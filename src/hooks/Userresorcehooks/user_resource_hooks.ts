import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUserResource, deleteUserResource, getUserResourceById, getUserResources, updateUserResource } from "../../api/userRecourceApi/user_resource_api";
import type { UserResource } from "../../types";

export function useUserResources() {
  return useQuery({
    queryKey: ["user-resources"],
    queryFn: getUserResources,
  });
}

// Один
export function useUserResource(id: number) {
  return useQuery({
    queryKey: ["user-resource", id],
    queryFn: () => getUserResourceById(id),
    enabled: !!id,
  });
}

// Создание
export function useCreateUserResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<UserResource, "id">) => createUserResource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-resources"] });
    },
  });
}

// Обновление
export function useUpdateUserResource(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<UserResource, "id">>) => updateUserResource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-resource", id] });
      queryClient.invalidateQueries({ queryKey: ["user-resources"] });
    },
  });
}

// Удаление
export function useDeleteUserResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUserResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-resources"] });
    },
  });
}