import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComponentValueResource, deleteComponentValueResource, getComponentValueResourceById, getComponentValueResources, updateComponentValueResource } from "../../api/componentsApi/components_resources_api";
import type { ValueResource } from "../../types";

export function useComponentValueResources(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  componentPk: number
) {
  return useQuery({
    queryKey: ["component-value-resources", projectPk, modulePk, compartmentPk, zonePk, componentPk],
    queryFn: () => getComponentValueResources(projectPk, modulePk, compartmentPk, zonePk, componentPk),
    enabled: !!projectPk && !!modulePk && !!compartmentPk && !!zonePk && !!componentPk,
  });
}

export function useComponentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  componentPk: number,
  id: number
) {
  return useQuery({
    queryKey: ["component-value-resource", projectPk, modulePk, compartmentPk, zonePk, componentPk, id],
    queryFn: () => getComponentValueResourceById(projectPk, modulePk, compartmentPk, zonePk, componentPk, id),
    enabled: !!id,
  });
}

export function useCreateComponentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  componentPk: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ValueResource, "id">) =>
      createComponentValueResource(projectPk, modulePk, compartmentPk, zonePk, componentPk, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["component-value-resources", projectPk, modulePk, compartmentPk, zonePk, componentPk],
      });
    },
  });
}

export function useUpdateComponentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  componentPk: number,
  id: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<ValueResource, "id">>) =>
      updateComponentValueResource(projectPk, modulePk, compartmentPk, zonePk, componentPk, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["component-value-resource", projectPk, modulePk, compartmentPk, zonePk, componentPk, id],
      });
      queryClient.invalidateQueries({
        queryKey: ["component-value-resources", projectPk, modulePk, compartmentPk, zonePk, componentPk],
      });
    },
  });
}

export function useDeleteComponentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  componentPk: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteComponentValueResource(projectPk, modulePk, compartmentPk, zonePk, componentPk, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["component-value-resources", projectPk, modulePk, compartmentPk, zonePk, componentPk],
      });
    },
  });
}