import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import "./modal.css";
import ResourceManager from "../resourcesCard/ResourcesCard";
import {
  useCreateDefaultResource,
  useDefaultResources,
  useUpdateDefaultResource,
} from "../../hooks/Cosmonautshooks/cosmonauts_resorce_hooks";
import { useDeleteDefaultResource } from "../../hooks/Catalogshooks/catalogs_resources_hooks";
import {
  createCosmonaut,
  updateCosmonaut,
} from "../../api/cosmonauts/cosmonauts";

interface PersonModalProps {
  onClose: () => void;
  existingPerson?: any;
}
interface Resource {
  id: number;
  resourceId: number | null;
  value: number;
  unit: string;
}

const PersonModal = ({ onClose, existingPerson }: PersonModalProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [preview, setPreview] = useState<string | null>(
    existingPerson?.photo || null
  );
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: existingPerson || {},
  });
  const createMutation = useCreateDefaultResource(existingPerson?.id ?? 1);
  const updateMutation = useUpdateDefaultResource(existingPerson?.id ?? 1);
  const deleteMutation = useDeleteDefaultResource(existingPerson?.id ?? 1);
  const { data: oldResources } = useDefaultResources(existingPerson?.id ?? 1);

  const editTable = async () => {
    const removed = oldResources.filter(
      (oldItem) => !resources.some((newItem) => newItem.id === oldItem.id)
    );

    const added = resources.filter(
      (newItem) => !oldResources.some((oldItem) => oldItem.id === newItem.id)
    );

    const changed = resources.filter((newItem) => {
      const oldItem = oldResources.find((o) => o.id === newItem.id);
      if (!oldItem) return false;
      return oldItem.teg !== newItem.teg || oldItem.value !== newItem.value;
    });

    for (const item of removed) {
      deleteMutation.mutate(item);
    }

    for (const item of added) {
      createMutation.mutate(item);
    }

    for (const item of changed) {
      updateMutation.mutate(item);
    }
  };

  const createTable = () => {
    for (const res of resources) {
      createMutation.mutate(res);
    }
  };

  useEffect(() => {
    if (existingPerson) {
      Object.keys(existingPerson).forEach((key) =>
        setValue(key, existingPerson[key])
      );
    }
  }, [existingPerson, setValue]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      let person;
      if (existingPerson) {
        person = await updateCosmonaut(existingPerson.id, formData); // PATCH
        editTable();
      } else {
        person = await createCosmonaut(formData); // POST
        createTable();
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
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <div className="form-group">
            <label>Фото</label>
            <div className="preview">
              <img
                src={preview || "/src/assets/placeholder.png"}
                alt="preview"
              />
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
          <ResourceManager resources={resources} setResources={setResources} />
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
