import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createProject, updateProject } from "../../api/projectsApi/projects_api";
import { updateProjectSettings } from "../../api/settingsApi/settings_api";


const CreateProjectModal = ({ onClose, existingProject }) => {
  const [preview, setPreview] = useState(existingProject?.preview || null);
  const [file, setFile] = useState(null);
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
    mutationFn: async (data) => {
      let project;

      if (existingProject) {
        // Редактирование — PATCH JSON
        const updateData = {
          name: data.name,
          description: data.description,
          teg: data.teg_id,
        };

        // Если есть новый файл, используем FormData для PATCH
        if (file) {
          const formData = new FormData();
          formData.append("name", data.name);
          formData.append("description", data.description);
          if (data.teg_id) formData.append("teg", data.teg_id);
          formData.append("preview", file);
          project = await updateProject(existingProject.id, formData, true); // true = FormData
        } else {
          project = await updateProject(existingProject.id, updateData);
        }

        console.log("Проект обновлён:", project);
      } else {
        // Создание — FormData
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        if (data.teg_id) formData.append("teg", data.teg_id);
        if (file) formData.append("preview", file);
        project = await createProject(formData);
        console.log("Создан проект:", project);
      }

      // Обновляем настройки проекта
      const settingsData = {
        recursive_water: data.recursive_water ? Number(data.recursive_water) : 0,
        max_weight: data.max_weight ? Number(data.max_weight) : 0,
        max_price: data.max_price ? Number(data.max_price) : 0,
      };
      console.log("Sending settings:", settingsData);
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
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-columns">
            <div className="form-column">
              <div className="preview">
                <img src={preview || "src/assets/Снимок экрана 2025-10-04 155715.png"} alt="preview" />
              </div>

              <div className="form-group">
                <label>Вставити фото</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const selected = e.target.files?.[0] || null;
                    setFile(selected);
                    if (selected) setPreview(URL.createObjectURL(selected));
                  }}
                />
              </div>

              <div className="form-group">
                <label>Назва проекту</label>
                <input {...register("name", { required: true })} placeholder="Наприклад Falcon X" />
                {errors.name && <p className="error">Поле названия обязательно</p>}
              </div>

              <div className="form-group">
                <label>Тег</label>
                <input {...register("teg_id")} placeholder="Наприклад Space" />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Бюджет ($)</label>
                <input type="number" {...register("max_price")} placeholder="Наприклад 20000000" />
              </div>

              <div className="form-group">
                <label>Максимальна вага (т)</label>
                <input type="number" {...register("max_weight")} placeholder="Наприклад 30" />
              </div>

              <div className="form-group">
                <label>Зворотна вода (%)</label>
                <input type="number" {...register("recursive_water")} placeholder="Наприклад 80" />
              </div>

              <div className="form-group">
                <label>Опис проекту</label>
                <textarea {...register("description")} placeholder="Наприклад: Це космічний проєкт для..." />
              </div>
            </div>
          </div>

          <button type="submit" disabled={mutation.isPending} className="submit-btn">
            {mutation.isPending
              ? existingProject ? "Редагування..." : "Створення..."
              : existingProject ? "Редагувати проєкт" : "Створити проєкт"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
