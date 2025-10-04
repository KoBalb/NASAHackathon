import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Project } from "../types";
import { createProject, deleteProject, getProjectById, getProjects, updateProject } from "../api/projectsApi/projects_api";


// список
export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
}

// один проект
export function useProject(id: number) {
  return useQuery<Project>({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
}

// создать
export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Project, "id" | "created_at" | "updated_at">) =>
      createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

// обновить
export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Omit<Project, "id" | "created_at" | "updated_at">>;
    }) => updateProject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
    },
  });
}

// удалить
export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}