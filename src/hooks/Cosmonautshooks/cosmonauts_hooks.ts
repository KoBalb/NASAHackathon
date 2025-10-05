import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCosmonaut, deleteCosmonaut, getCosmonautById, getCosmonauts, updateCosmonaut } from "../../api/cosmonauts/cosmonauts";
import type { Cosmonaut } from "../../types";

export function useCosmonauts() {
  return useQuery({
    queryKey: ["cosmonauts"],
    queryFn: getCosmonauts,
  });
}

// Один космонавт
export function useCosmonaut(id: number) {
  return useQuery({
    queryKey: ["cosmonaut", id],
    queryFn: () => getCosmonautById(id),
    enabled: !!id,
  });
}

// Создание
export function useCreateCosmonaut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Cosmonaut, "id">) => createCosmonaut(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cosmonauts"] });
    },
  });
}

// Обновление
export function useUpdateCosmonaut(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<Cosmonaut, "id">>) => updateCosmonaut(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cosmonauts"] });
      queryClient.invalidateQueries({ queryKey: ["cosmonaut", id] });
    },
  });
}

// Удаление
export function useDeleteCosmonaut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCosmonaut(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["cosmonauts"] });
      queryClient.invalidateQueries({ queryKey: ["cosmonaut", id] });
    },
  });
}