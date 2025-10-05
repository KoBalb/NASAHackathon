import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUserMaterial, deleteUserMaterial, getUserMaterialById, getUserMaterials, updateUserMaterial } from "../../api/materialApi/material_api";
import type { Material } from "../../types";

export function useUserMaterials() {
  return useQuery({
    queryKey: ["user-materials"],
    queryFn: getUserMaterials,
  });
}

// Один
export function useUserMaterial(id: number) {
  return useQuery({
    queryKey: ["user-material", id],
    queryFn: () => getUserMaterialById(id),
    enabled: !!id,
  });
}

// Создание
export function useCreateUserMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Material, "id">) => createUserMaterial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-materials"] });
    },
  });
}

// Обновление
export function useUpdateUserMaterial(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<Material, "id">>) => updateUserMaterial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-material", id] });
      queryClient.invalidateQueries({ queryKey: ["user-materials"] });
    },
  });
}

// Удаление
export function useDeleteUserMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUserMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-materials"] });
    },
  });
}