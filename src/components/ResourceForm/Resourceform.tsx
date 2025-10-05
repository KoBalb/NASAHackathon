import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserResource, updateUserResource } from "../../api/userRecourceApi/user_resource_api";
import "./modal.css";

type FormValues = {
  id: number;
  name: string;
  icon: FileList;
  measurement: string;
  limit: number;
  is_limit_type_big: boolean;
  stock: number;
  is_stock_percentage: boolean;
};

interface ResourceFormProps {
  onClose: () => void;
  existingResource?: { id: number };
}

const ResourceForm = ({ onClose, existingResource }: ResourceFormProps) => {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      id: 1,
      name: "",
      measurement: "",
      limit: 0,
      is_limit_type_big: true,
      stock: 0,
      is_stock_percentage: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("measurement", data.measurement);
      formData.append("limit", String(data.limit));
      formData.append("is_limit_type_big", String(data.is_limit_type_big));
      formData.append("stock", String(data.stock));
      formData.append("is_stock_percentage", String(data.is_stock_percentage));

      if (data.icon && data.icon[0]) {
        formData.append("icon", data.icon[0]);
      }

      if (existingResource?.id) {
        return await updateUserResource(existingResource.id, formData);
      } else {
        return await createUserResource(formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      onClose();
    },
    onError: (error) => {
      console.error("Ошибка при сохранении ресурса:", error);
      alert("Помилка при створенні ресурсу");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log("Отправляем FormData:", data);
    mutation.mutate(data);
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <form onSubmit={handleSubmit(onSubmit)} className="form">

          {/* Фото */}
         <div className="form-group image-upload">
            {preview && <img src={preview} alt="preview" className="preview" />}
            <input type="file" accept="image/*" {...register("icon")} onChange={handleFileChange} />
        </div>

          {/* Название */}
          <div className="form-group">
            <label>Назва ресурсу</label>
            <input {...register("name", { required: true })} />
          </div>

          {/* Единицы измерения */}
          <div className="form-group">
            <label>Одиниці виміру</label>
            <input {...register("measurement", { required: true })} maxLength={25}/>
          </div>

          {/* Лимит + макс/мин */}
          <div className="form-group">
            <label>Значення ліміту</label>
            <div className="row">
              <input
                type="number"
                {...register("limit", { valueAsNumber: true })}
              />

              <Controller
                name="is_limit_type_big"
                control={control}
                render={({ field }) => (
                  <div className="unit-toggle">
                    <button
                      type="button"
                      className={field.value ? "active" : ""}
                      onClick={() => field.onChange(true)}
                    >
                      Максимум
                    </button>
                    <button
                      type="button"
                      className={!field.value ? "active" : ""}
                      onClick={() => field.onChange(false)}
                    >
                      Мінімум
                    </button>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Запас + шт/% */}
          <div className="form-group">
            <label>Запас</label>
            <div className="row">
              <input
                type="number"
                {...register("stock", { valueAsNumber: true })}
              />

              <Controller
                name="is_stock_percentage"
                control={control}
                render={({ field }) => (
                  <div className="unit-toggle">
                    <button
                      type="button"
                      className={!field.value ? "active" : ""}
                      onClick={() => field.onChange(false)}
                    >
                      шт
                    </button>
                    <button
                      type="button"
                      className={field.value ? "active" : ""}
                      onClick={() => field.onChange(true)}
                    >
                      %
                    </button>
                  </div>
                )}
              />
            </div>
          </div>

          <button type="submit" disabled={mutation.isPending} className="submit-btn">
            {existingResource ? "Редагувати" : "Створити"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ResourceForm;