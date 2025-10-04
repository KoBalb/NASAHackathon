import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ValueResource } from "../../types";
import { createDefaultResource, deleteDefaultResource, getDefaultResourceId, getDefaultResources, updateDefaultResource } from "../../api/catalogsApi/catalogs_reosources_api";

// Получение списка
export function useDefaultResources(catalogPk: number) {
  return useQuery<ValueResource[], Error>({
    queryKey: ["default-resources", catalogPk],
    queryFn: () => getDefaultResources(catalogPk),
    enabled: !!catalogPk, // только если передан catalogPk
  });
}

// Получение одного ресурса по id
export function useDefaultResource(catalogPk: number, id: number) {
  return useQuery<ValueResource, Error>({
    queryKey: ["default-resources", catalogPk, id],
    queryFn: () => getDefaultResourceId(catalogPk, id),
    enabled: !!catalogPk && !!id,
  });
}

// Создание ресурса
export function useCreateDefaultResource(catalogPk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ValueResource, "id">) =>
      createDefaultResource(catalogPk, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["default-resources", catalogPk] });
    },
  });
}

// Обновление ресурса
export function useUpdateDefaultResource(catalogPk: number, id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<ValueResource, "id">>) =>
      updateDefaultResource(catalogPk, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["default-resources", catalogPk] });
      queryClient.invalidateQueries({ queryKey: ["default-resources", catalogPk, id] });
    },
  });
}

// Удаление ресурса
export function useDeleteDefaultResource(catalogPk: number, id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteDefaultResource(catalogPk, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["default-resources", catalogPk] });
    },
  });
}