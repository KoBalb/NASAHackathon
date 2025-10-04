import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createInnerComponentValueResource, deleteInnerComponentValueResource, getInnerComponentValueResourceById, getInnerComponentValueResources, updateInnerComponentValueResource } from "../../api/innerComponentsApi/inner_components_resources_api";
import type { ValueResource } from "../../types";

export function useInnerComponentValueResources(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  innerComponentPk: number
) {
  return useQuery({
    queryKey: ["inner-component-value-resources", projectPk, modulePk, compartmentPk, zonePk, closetPk, innerComponentPk],
    queryFn: () => getInnerComponentValueResources(projectPk, modulePk, compartmentPk, zonePk, closetPk, innerComponentPk),
    enabled: !!projectPk && !!modulePk && !!compartmentPk && !!zonePk && !!closetPk && !!innerComponentPk,
  });
}

export function useInnerComponentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  innerComponentPk: number,
  id: number
) {
  return useQuery({
    queryKey: ["inner-component-value-resource", projectPk, modulePk, compartmentPk, zonePk, closetPk, innerComponentPk, id],
    queryFn: () => getInnerComponentValueResourceById(projectPk, modulePk, compartmentPk, zonePk, closetPk, innerComponentPk, id),
    enabled: !!id,
  });
}

export function useCreateInnerComponentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  innerComponentPk: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ValueResource, "id">) =>
      createInnerComponentValueResource(projectPk, modulePk, compartmentPk, zonePk, closetPk, innerComponentPk, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inner-component-value-resources", projectPk, modulePk, compartmentPk, zonePk, closetPk, innerComponentPk],
      });
    },
  });
}

export function useUpdateInnerComponentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  innerComponentPk: number,
  id: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<ValueResource, "id">>) =>
      updateInnerComponentValueResource(projectPk, modulePk, compartmentPk, zonePk, closetPk, innerComponentPk, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inner-component-value-resource", projectPk, modulePk, compartmentPk, zonePk, closetPk, innerComponentPk, id],
      });
      queryClient.invalidateQueries({
        queryKey: ["inner-component-value-resources", projectPk, modulePk, compartmentPk, zonePk, closetPk, innerComponentPk],
      });
    },
  });
}

export function useDeleteInnerComponentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  innerComponentPk: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      deleteInnerComponentValueResource(projectPk, modulePk, compartmentPk, zonePk, closetPk, innerComponentPk, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inner-component-value-resources", projectPk, modulePk, compartmentPk, zonePk, closetPk, innerComponentPk],
      });
    },
  });
}