import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createModule, deleteModule, getModule, getModules, updateModule } from "../../api/modulesApi/modules_api";
import type { Module } from "../../types";

export function useModules(projectPk: number) {
  return useQuery({
    queryKey: ["modules", projectPk],
    queryFn: () => getModules(projectPk),
    enabled: !!projectPk,
  });
}

export function useModule(projectPk: number, id: number) {
  return useQuery({
    queryKey: ["module", projectPk, id],
    queryFn: () => getModule(projectPk, id),
    enabled: !!id,
  });
}

export function useCreateModule(projectPk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Module) => createModule(projectPk, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules", projectPk] });
    },
  });
}

export function useUpdateModule(projectPk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Module }) =>
      updateModule(projectPk, id, data),
    onSuccess: (_data, variables) => { // <- здесь variables
      queryClient.invalidateQueries({ queryKey: ["module", projectPk, variables.id] });
      queryClient.invalidateQueries({ queryKey: ["modules", projectPk] });
      console.log(`[${new Date().toISOString()}] Module updated`, variables);
    },
  });
}

export function useDeleteModule(projectPk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteModule(projectPk, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules", projectPk] });
    },
  });
}