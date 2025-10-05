import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createUserResource, updateUserResource } from "../../api/userRecourceApi/user_resource_api";

interface ResourceModalProps {
  onClose: () => void;
  existingResource?: any; // ресурс для редактирования
}

const ResourceModal = ({ onClose, existingResource }: ResourceModalProps) => {
  const [preview, setPreview] = useState<string | null>(existingResource?.photo || null);
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm({
    defaultValues: existingResource || {},
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      let resource;
      if (existingResource) {
        resource = await updateUserResource(existingResource.id, formData);
      } else {
        resource = await createUserResource(formData);
      }
      return resource;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
      onClose();
    },
    onError: (error) => {
      console.error("Ошибка при сохранении ресурса:", error);
      alert("Ошибка при сохранении ресурса");
      console.log(error);
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
          <div className="form-group">
            <label>Фото ресурса</label>
            <div className="preview">
              <img src={preview || "/placeholder.png"} alt="preview" />
            </div>
            <input type="file" accept="image/*" {...register("photo")} onChange={handleFileChange} />
          </div>
          <button type="submit" className="submit-btn">
            {existingResource ? "Обновить фото" : "Добавить фото"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ResourceModal;



