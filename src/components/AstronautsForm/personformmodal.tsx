import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";

import "./modal.css";
import { useCreateCosmonaut, useUpdateCosmonaut } from "../../hooks/Cosmonautshooks/cosmonauts_hooks";

interface PersonModalProps {
  onClose: () => void;
  existingPerson?: any;
}

const PersonModal = ({ onClose, existingPerson }: PersonModalProps) => {
  const [preview, setPreview] = useState<string | null>(
    existingPerson?.photo || null
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: existingPerson || {},
  });

  const createMutation = useCreateCosmonaut();
  const updateMutation = useUpdateCosmonaut();

  useEffect(() => {
    if (existingPerson) {
      Object.keys(existingPerson).forEach((key) =>
        setValue(key, existingPerson[key])
      );
    }
  }, [existingPerson, setValue]);

  // ESC для закрытия
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.photo && data.photo[0]) {
      formData.append("photo", data.photo[0]);
    }

    if (existingPerson) {
      await updateMutation.mutateAsync({ id: existingPerson.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }

    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <label>Фото</label>
            <div className="preview">
              <img src={preview || "/src/assets/placeholder.png"} alt="preview" />
            </div>
            <input
              type="file"
              accept="image/*"
              {...register("photo")}
              onChange={handleFileChange}
            />
          </div>

          <div className="form-group">
            <label>ПІБ</label>
            <input {...register("name", { required: true })} />
            {errors.name && <p className="error">Поле ПІБ обязательно</p>}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="submit-btn"
            >
              {existingPerson ? "Редагувати" : "Створити"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default PersonModal;