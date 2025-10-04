import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComponent, deleteComponent, getComponentById, getComponents, updateComponent } from "../../api/componentsApi/componentsApi";
import type { Component as ProjectComponent } from "../../types";

export function useComponents(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number
) {
  return useQuery({
    queryKey: ["components", projectPk, modulePk, compartmentPk, zonePk],
    queryFn: () => getComponents(projectPk, modulePk, compartmentPk, zonePk),
    enabled: !!projectPk && !!modulePk && !!compartmentPk && !!zonePk,
  });
}

export function useComponent(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  id: number
) {
  return useQuery({
    queryKey: ["component", projectPk, modulePk, compartmentPk, zonePk, id],
    queryFn: () => getComponentById(projectPk, modulePk, compartmentPk, zonePk, id),
    enabled: !!id,
  });
}

export function useCreateComponent(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectComponent) =>
      createComponent(projectPk, modulePk, compartmentPk, zonePk, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["components", projectPk, modulePk, compartmentPk, zonePk],
      });
    },
  });
}

export function useUpdateComponent(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  id: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectComponent) =>
      updateComponent(projectPk, modulePk, compartmentPk, zonePk, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["component", projectPk, modulePk, compartmentPk, zonePk, id],
      });
      queryClient.invalidateQueries({
        queryKey: ["components", projectPk, modulePk, compartmentPk, zonePk],
      });
    },
  });
}

export function useDeleteComponent(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      deleteComponent(projectPk, modulePk, compartmentPk, zonePk, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["components", projectPk, modulePk, compartmentPk, zonePk],
      });
    },
  });
}