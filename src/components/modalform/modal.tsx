import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, updateProject } from "../../api/projectsApi/projects_api";
import { updateProjectSettings } from "../../api/settingsApi/settings_api";
import "./modal.css";

interface CreateProjectModalProps {
  onClose: () => void;
  existingProject?: any; // проект для редактирования
}

const CreateProjectModal = ({ onClose, existingProject }: CreateProjectModalProps) => {
  const [preview, setPreview] = useState<string | null>(existingProject?.preview || null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: existingProject || {},
  });

  useEffect(() => {
    if (existingProject) {
      Object.keys(existingProject).forEach((key) => {
        setValue(key, existingProject[key]);
      });
    }
  }, [existingProject, setValue]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      if (data.teg_id) formData.append("teg", data.teg_id);

      // добавляем новое фото только если выбрано
      if (data.preview && data.preview[0]) {
        formData.append("preview", data.preview[0]);
      }

      let project;
      if (existingProject) {
        project = await updateProject(existingProject.id, formData);
        console.log("Проект обновлён:", project);
      } else {
        project = await createProject(formData as any);
        console.log("Создан проект:", project);
      }

      // обновляем настройки проекта
      const settingsData = {
        recursive_water: data.recursive_water || 0,
        max_weight: data.max_weight || 0,
        max_price: data.max_price || 0,
      };
      await updateProjectSettings(project.id, settingsData);
      console.log("Настройки проекта обновлены:", settingsData);

      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      onClose();
    },
    onError: (error) => {
      console.error("Ошибка при сохранении проекта или настроек:", error);
      alert("Ошибка при сохранении проекта или настроек");
    },
  });

  const onSubmit = (data: any) => mutation.mutate(data);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-columns">
            <div className="form-column">
              <div className="preview">
                <img src={preview || "/src/assets/placeholder.png"} alt="preview" />
              </div>
              <div className="form-group">
                <label>Вставити фото</label>
                <input type="file" accept="image/*" {...register("preview")} onChange={handleFileChange} />
              </div>
              <div className="form-group">
                <label>Назва проекту</label>
                <input {...register("name", { required: true })} />
                {errors.name && <p className="error">Поле названия обязательно</p>}
              </div>
              <div className="form-group">
                <label>Тег</label>
                <input {...register("teg_id")} />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Бюджет ($)</label>
                <input type="number" {...register("max_price")} />
              </div>
              <div className="form-group">
                <label>Максимальна вага (т)</label>
                <input type="number" {...register("max_weight")} />
              </div>
              <div className="form-group">
                <label>Зворотна вода (%)</label>
                <input type="number" {...register("recursive_water")} />
              </div>
              <div className="form-group">
                <label>Опис проекту</label>
                <textarea {...register("description")} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={mutation.isPending} className="submit-btn">
            {existingProject ? "Редагувати" : "Створити"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreateProjectModal;