import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCompartmentValueResource, deleteCompartmentValueResource, getCompartmentValueResourceById, getCompartmentValueResources, updateCompartmentValueResource } from "../../api/compartmentsApi/compartments_resources_api";
import type { ValueResource } from "../../types";

export function useCompartmentValueResources(projectPk: number, modulePk: number, compartmentPk: number) {
  return useQuery({
    queryKey: ["compartment-value-resources", projectPk, modulePk, compartmentPk],
    queryFn: () => getCompartmentValueResources(projectPk, modulePk, compartmentPk),
    enabled: !!projectPk && !!modulePk && !!compartmentPk,
  });
}

export function useCompartmentValueResource(projectPk: number, modulePk: number, compartmentPk: number, id: number) {
  return useQuery({
    queryKey: ["compartment-value-resource", projectPk, modulePk, compartmentPk, id],
    queryFn: () => getCompartmentValueResourceById(projectPk, modulePk, compartmentPk, id),
    enabled: !!id,
  });
}

export function useCreateCompartmentValueResource(projectPk: number, modulePk: number, compartmentPk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ValueResource, "id">) =>
      createCompartmentValueResource(projectPk, modulePk, compartmentPk, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compartment-value-resources", projectPk, modulePk, compartmentPk] });
    },
  });
}

export function useUpdateCompartmentValueResource(projectPk: number, modulePk: number, compartmentPk: number, id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<ValueResource, "id">>) =>
      updateCompartmentValueResource(projectPk, modulePk, compartmentPk, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compartment-value-resource", projectPk, modulePk, compartmentPk, id] });
      queryClient.invalidateQueries({ queryKey: ["compartment-value-resources", projectPk, modulePk, compartmentPk] });
    },
  });
}

export function useDeleteCompartmentValueResource(projectPk: number, modulePk: number, compartmentPk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCompartmentValueResource(projectPk, modulePk, compartmentPk, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compartment-value-resources", projectPk, modulePk, compartmentPk] });
    },
  });
}