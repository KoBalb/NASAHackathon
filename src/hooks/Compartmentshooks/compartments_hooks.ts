import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCompartment, deleteCompartment, getCompartmentById, getCompartments, updateCompartment } from "../../api/compartmentsApi/compartments_api";
import type { Compartment } from "../../types";

export function useCompartments(projectPk: number, modulePk: number) {
  return useQuery({
    queryKey: ["compartments", projectPk, modulePk],
    queryFn: () => getCompartments(projectPk, modulePk),
    enabled: !!projectPk && !!modulePk,
  });
}

export function useCompartment(projectPk: number, modulePk: number, id: number) {
  return useQuery({
    queryKey: ["compartment", projectPk, modulePk, id],
    queryFn: () => getCompartmentById(projectPk, modulePk, id),
    enabled: !!id,
  });
}

export function useCreateCompartment(projectPk: number, modulePk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Compartment) => createCompartment(projectPk, modulePk, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compartments", projectPk, modulePk] });
    },
  });
}

export function useUpdateCompartment(projectPk: number, modulePk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Compartment }) => {
      if (projectPk == null || modulePk == null) throw new Error("Project or module ID missing");
      return updateCompartment(projectPk, modulePk, id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["compartment", projectPk, modulePk, variables.id] });
      queryClient.invalidateQueries({ queryKey: ["compartments", projectPk, modulePk] });
    },
  });
}

export function useDeleteCompartment(projectPk: number, modulePk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCompartment(projectPk, modulePk, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compartments", projectPk, modulePk] });
    },
  });
}