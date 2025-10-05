import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTegProject, deleteTegProject, getTegProjectById, getTegProjects, updateTegProject } from "../../api/tegProjectApi/teg_project";
import type { TegProject } from "../../types";

export function useTegProjects() {
  return useQuery({
    queryKey: ["teg-projects"],
    queryFn: getTegProjects,
  });
}

// Один
export function useTegProject(id: number) {
  return useQuery({
    queryKey: ["teg-project", id],
    queryFn: () => getTegProjectById(id),
    enabled: !!id,
  });
}

// Создание
export function useCreateTegProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<TegProject, "id">) => createTegProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teg-projects"] });
    },
  });
}

// Обновление
export function useUpdateTegProject(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<TegProject, "id">>) => updateTegProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teg-project", id] });
      queryClient.invalidateQueries({ queryKey: ["teg-projects"] });
    },
  });
}

// Удаление
export function useDeleteTegProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTegProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teg-projects"] });
    },
  });
}