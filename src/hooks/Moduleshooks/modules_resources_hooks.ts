import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createModuleValueResource, deleteModuleValueResource, getModuleValueResourceById, getModuleValueResources, updateModuleValueResource } from "../../api/modulesApi/modules_resources_api";
import type { ValueResource } from "../../types";

export function useModuleValueResources(projectPk: number, modulePk: number) {
  return useQuery({
    queryKey: ["module-value-resources", projectPk, modulePk],
    queryFn: () => getModuleValueResources(projectPk, modulePk),
    enabled: !!projectPk && !!modulePk,
  });
}

export function useModuleValueResource(projectPk: number, modulePk: number, id: number) {
  return useQuery({
    queryKey: ["module-value-resource", projectPk, modulePk, id],
    queryFn: () => getModuleValueResourceById(projectPk, modulePk, id),
    enabled: !!id,
  });
}

export function useCreateModuleValueResource(projectPk: number, modulePk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ValueResource, "id">) => createModuleValueResource(projectPk, modulePk, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module-value-resources", projectPk, modulePk] });
    },
  });
}

export function useUpdateModuleValueResource(projectPk: number, modulePk: number, id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<ValueResource, "id">>) => updateModuleValueResource(projectPk, modulePk, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module-value-resource", projectPk, modulePk, id] });
      queryClient.invalidateQueries({ queryKey: ["module-value-resources", projectPk, modulePk] });
    },
  });
}

export function useDeleteModuleValueResource(projectPk: number, modulePk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteModuleValueResource(projectPk, modulePk, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module-value-resources", projectPk, modulePk] });
    },
  });
}