import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTeg, deleteTeg, getTegById, getTegs, updateTeg } from "../../api/tegApi/teg_api";
import type { Teg } from "../../types";

export function useTegs() {
  return useQuery({
    queryKey: ["tegs"],
    queryFn: getTegs,
  });
}

// Один
export function useTeg(id: number) {
  return useQuery({
    queryKey: ["teg", id],
    queryFn: () => getTegById(id),
    enabled: !!id,
  });
}

// Создание
export function useCreateTeg() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Teg, "id">) => createTeg(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tegs"] });
    },
  });
}

// Обновление
export function useUpdateTeg(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<Teg, "id">>) => updateTeg(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teg", id] });
      queryClient.invalidateQueries({ queryKey: ["tegs"] });
    },
  });
}

// Удаление
export function useDeleteTeg() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTeg(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tegs"] });
    },
  });
}