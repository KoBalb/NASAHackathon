import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import "./modal.css";

interface PersonModalProps {
  onClose: () => void;
  existingPerson?: any;
}

const PersonModal = ({ onClose, existingPerson }: PersonModalProps) => {
  const [preview, setPreview] = useState<string | null>(existingPerson?.photo || null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: existingPerson || {},
  });

  useEffect(() => {
    if (existingPerson) {
      Object.keys(existingPerson).forEach((key) => setValue(key, existingPerson[key]));
    }
  }, [existingPerson, setValue]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append("full_name", data.full_name);
      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      let person;
      if (existingPerson) {
        person = await updatePerson(existingPerson.id, formData); // PATCH
      } else {
        person = await createPerson(formData); // POST
      }

      return person;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["persons"]);
      onClose();
    },
    onError: (err) => {
      console.error("Ошибка при сохранении:", err);
      alert("Ошибка при сохранении");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <div className="form-group">
            <label>Фото</label>
            <div className="preview">
              <img src={preview || "/src/assets/placeholder.png"} alt="preview" />
            </div>
            <input type="file" accept="image/*" {...register("photo")} onChange={handleFileChange} />
          </div>

          <div className="form-group">
            <label>ПІБ</label>
            <input {...register("full_name", { required: true })} />
            {errors.full_name && <p className="error">Поле ПІБ обязательно</p>}
          </div>

          <button type="submit" disabled={mutation.isPending}>
            {existingPerson ? "Редагувати" : "Створити"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default PersonModal;

