import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createExternalSystem, deleteExternalSystem, getExternalSystemById, getExternalSystems, updateExternalSystem } from "../../api/externalSystemsApi/external_systems_api";
import type { ExternalSystem } from "../../types";

export function useExternalSystems(projectPk: string) {
  return useQuery({
    queryKey: ["external-systems", projectPk],
    queryFn: () => getExternalSystems(projectPk),
    enabled: !!projectPk,
  });
}

export function useExternalSystem(projectPk: string, id: number) {
  return useQuery({
    queryKey: ["external-system", projectPk, id],
    queryFn: () => getExternalSystemById(projectPk, id),
    enabled: !!id,
  });
}

export function useCreateExternalSystem(projectPk: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ExternalSystem) => createExternalSystem(projectPk, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-systems", projectPk] });
    },
  });
}

export function useUpdateExternalSystem(projectPk: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ExternalSystem }) =>
      updateExternalSystem(projectPk, id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["external-system", projectPk, variables.id] });
      queryClient.invalidateQueries({ queryKey: ["external-systems", projectPk] });
      console.log(`[${new Date().toISOString()}] External system updated`, variables);
    },
  });
}

export function useDeleteExternalSystem(projectPk: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteExternalSystem(projectPk, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-systems", projectPk] });
    },
  });
}