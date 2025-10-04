import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ValueResource } from "../../types";
import { createExternalSystemsResource, deleteExternalSystemsResource, getExternalSystemsResourceById, getExternalSystemsResources, updateExternalSystemsResource } from "../../api/externalSystemsApi/external_systems_resources_api";

export function useExternalSystemsResources(projectPk: number, externalSystemPk: number) {
  return useQuery({
    queryKey: ["external-system-resources", projectPk, externalSystemPk],
    queryFn: () => getExternalSystemsResources(projectPk, externalSystemPk),
    enabled: !!projectPk && !!externalSystemPk,
  });
}

export function useExternalSystemsResource(projectPk: number, externalSystemPk: number, id: number) {
  return useQuery({
    queryKey: ["external-system-resource", projectPk, externalSystemPk, id],
    queryFn: () => getExternalSystemsResourceById(projectPk, externalSystemPk, id),
    enabled: !!id,
  });
}

export function useCreateExternalSystemsResource(projectPk: number, externalSystemPk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ValueResource, "id">) =>
      createExternalSystemsResource(projectPk, externalSystemPk, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["external-system-resources", projectPk, externalSystemPk],
      });
    },
  });
}

export function useUpdateExternalSystemsResource(projectPk: number, externalSystemPk: number, id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<ValueResource, "id">>) =>
      updateExternalSystemsResource(projectPk, externalSystemPk, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["external-system-resource", projectPk, externalSystemPk, id],
      });
      queryClient.invalidateQueries({
        queryKey: ["external-system-resources", projectPk, externalSystemPk],
      });
    },
  });
}

export function useDeleteExternalSystemsResource(projectPk: number, externalSystemPk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteExternalSystemsResource(projectPk, externalSystemPk, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["external-system-resources", projectPk, externalSystemPk],
      });
    },
  });
}