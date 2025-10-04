import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createInnerComponent, deleteInnerComponent, getInnerComponentById, getInnerComponents, updateInnerComponent } from "../../api/innerComponentsApi/inner_components_api";
import type { InnerComponent } from "../../types";

export function useInnerComponents(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number
) {
  return useQuery({
    queryKey: ["inner-components", projectPk, modulePk, compartmentPk, zonePk, closetPk],
    queryFn: () => getInnerComponents(projectPk, modulePk, compartmentPk, zonePk, closetPk),
    enabled: !!projectPk && !!modulePk && !!compartmentPk && !!zonePk && !!closetPk,
  });
}

export function useInnerComponent(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  id: number
) {
  return useQuery({
    queryKey: ["inner-component", projectPk, modulePk, compartmentPk, zonePk, closetPk, id],
    queryFn: () => getInnerComponentById(projectPk, modulePk, compartmentPk, zonePk, closetPk, id),
    enabled: !!id,
  });
}

export function useCreateInnerComponent(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InnerComponent) =>
      createInnerComponent(projectPk, modulePk, compartmentPk, zonePk, closetPk, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inner-components", projectPk, modulePk, compartmentPk, zonePk, closetPk],
      });
    },
  });
}

export function useUpdateInnerComponent(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  id: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InnerComponent) =>
      updateInnerComponent(projectPk, modulePk, compartmentPk, zonePk, closetPk, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inner-component", projectPk, modulePk, compartmentPk, zonePk, closetPk, id],
      });
      queryClient.invalidateQueries({
        queryKey: ["inner-components", projectPk, modulePk, compartmentPk, zonePk, closetPk],
      });
    },
  });
}

export function useDeleteInnerComponent(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (innerComponentId: number) =>
      deleteInnerComponent(projectPk, modulePk, compartmentPk, zonePk, closetPk, innerComponentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inner-components", projectPk, modulePk, compartmentPk, zonePk, closetPk],
      });
    },
  });
}