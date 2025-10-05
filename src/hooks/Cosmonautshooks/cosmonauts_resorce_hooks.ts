import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDefaultResource, deleteDefaultResource, getDefaultResources, updateDefaultResource } from "../../api/catalogsApi/catalogs_reosources_api";
import { getDefaultResourceById } from "../../api/cosmonauts/cosmonauts_default_recource";
import type { CosmonautDefaultResource } from "../../types";

// Список default-resources космонавта
export function useDefaultResources(cosmonautId: number) {
  return useQuery({
    queryKey: ["default-resources", cosmonautId],
    queryFn: () => getDefaultResources(cosmonautId),
    enabled: !!cosmonautId,
  });
}

// Один ресурс
export function useDefaultResource(cosmonautId: number, id: number) {
  return useQuery({
    queryKey: ["default-resource", cosmonautId, id],
    queryFn: () => getDefaultResourceById(cosmonautId, id),
    enabled: !!cosmonautId && !!id,
  });
}

// Создание
export function useCreateDefaultResource(cosmonautId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CosmonautDefaultResource) => createDefaultResource(cosmonautId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["default-resources", cosmonautId] });
    },
  });
}

// Обновление
export function useUpdateDefaultResource(cosmonautId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CosmonautDefaultResource>) =>
      updateDefaultResource(cosmonautId, data.id, data),
    onSuccess: (_, data: CosmonautDefaultResource) => {
      queryClient.invalidateQueries({ queryKey: ["default-resources", cosmonautId] });
      queryClient.invalidateQueries({ queryKey: ["default-resource", cosmonautId, data.id] });
    },
  });
}

// Удаление
export function useDeleteDefaultResource(cosmonautId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteDefaultResource(cosmonautId, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["default-resources", cosmonautId] });
      queryClient.invalidateQueries({ queryKey: ["default-resource", cosmonautId, id] });
    },
  });
}