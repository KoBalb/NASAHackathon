import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./modal.css";
import type { Catalog, CatalogsDefaultValue } from "../../types";
import { useTegs } from "../../hooks/Teghooks/teg_hooks";
import {
  createCatalog,
  updateCatalog,
} from "../../api/catalogsApi/catalogs_api";
import {
  getDefaultValue,
  updateDefaultValue,
} from "../../api/catalogsApi/catalogs_default_value";

interface CreateProjectModalProps {
  onClose: () => void;
  existingCatalog?: Catalog; // проект для редактирования
}

const CreateCatalogModal = ({
  onClose,
  existingCatalog,
}: CreateProjectModalProps) => {
  const [preview, setPreview] = useState<string | null>(
    existingCatalog?.photo || null
  );
  const queryClient = useQueryClient();
  const { data: tags } = useTegs();
  const { data: defaultValue } = getDefaultValue(existingCatalog?.id || 5);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Catalog & CatalogsDefaultValue>({
    defaultValues: {
      ...defaultValue,
      ...(existingCatalog ? existingCatalog : { w: 0, h: 0, d: 0 }),
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: Catalog & CatalogsDefaultValue) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      if (data.teg) formData.append("teg", data.teg);
      if (data.photo[0] === "h") {
        // не трогать
        formData.delete("photo");
      } else {
        formData.append("photo", data.photo[0]);
      }
      let сatalog;
      if (existingCatalog) {
        сatalog = await updateCatalog(existingCatalog.id, formData);
      } else {
        сatalog = await createCatalog(formData);
      }
      //
      // обновляем настройки проекта
      const settingsData = {
        comment: data.comment || "",
        weight: data.weight || 0,
        price: data.price || 0,
        d: data.d || 0,
        h: data.h || 0,
        w: data.w || 0,
      };
      await updateDefaultValue(сatalog.id, settingsData);

      return сatalog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    },
    onError: (error) => {
      console.error("Ошибка при сохранении проекта или настроек:", error);
      alert("Ошибка при сохранении проекта или настроек");
    },
  });

  const onSubmit = (data: Catalog & CatalogsDefaultValue) =>
    mutation.mutate(data);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-columns">
            <div className="form-column">
              <div className="preview">
                <img
                  src={preview || "/src/assets/placeholder.png"}
                  alt="photo"
                />
              </div>
              <div className="form-group">
                <label>Вставити фото</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("photo")}
                  onChange={handleFileChange}
                />
              </div>
              <div className="form-group">
                <label>Назва каталога</label>
                <input {...register("name", { required: true })} />
                {errors.name && (
                  <p className="error">Поле названия обязательно</p>
                )}
              </div>
              <div className="form-group">
                <label>Тип каталога</label>
                <select {...register("type", { required: true })}>
                  <option value="">-- Вибери тег --</option>
                  <option value="ES">Зовнішня сестеми</option>
                  <option value="CO">Компонент</option>
                  <option value="SL">Шафа</option>
                  <option value="ZN">Зони</option>
                  <option value="CM">Відсік</option>
                  <option value="MO">Модуль</option>
                </select>
                {errors.name && (
                  <p className="error">Поле названия обязательно</p>
                )}
              </div>
              <div className="form-group">
                <label>Тег</label>
                <select {...register("teg")}>
                  <option value="">-- Вибери тег --</option>
                  {(tags ?? []).map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Коментар</label>
                <textarea {...register("comment")} />
              </div>

              <div className="form-group">
                <label>Вага, кг</label>
                <input type="number" {...register("weight")} />
              </div>

              <div className="form-group">
                <label>Ціна ($)</label>
                <input type="number" {...register("price")} />
              </div>

              <div className="dimensions">
                <div className="form-group">
                  <label>Висота, см.</label>
                  <input type="number" {...register("h")} />
                </div>
                <div className="form-group">
                  <label>Ширина, см.</label>
                  <input type="number" {...register("w")} />
                </div>
                <div className="form-group">
                  <label>Глибина, см.</label>
                  <input type="number" {...register("d")} />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="submit-btn"
          >
            {existingCatalog ? "Редагувати" : "Створити"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreateCatalogModal;
