import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMission, deleteMission, getMissionById, getMissions, updateMission } from "../../api/missionsApi/missions_api";
import type { Mission } from "../../types";

export function useMissions(projectPk: number) {
  return useQuery({
    queryKey: ["missions", projectPk],
    queryFn: () => getMissions(projectPk),
    enabled: !!projectPk,
  });
}

// По id
export function useMission(projectPk: number, id: number) {
  return useQuery({
    queryKey: ["mission", projectPk, id],
    queryFn: () => getMissionById(projectPk, id),
    enabled: !!id,
  });
}

// Создание
export function useCreateMission(projectPk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Mission, "id">) => createMission(projectPk, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions", projectPk] });
    },
  });
}

// Обновление
export function useUpdateMission(projectPk: number, id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<Mission, "id">>) => updateMission(projectPk, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mission", projectPk, id] });
      queryClient.invalidateQueries({ queryKey: ["missions", projectPk] });
    },
  });
}

// Удаление
export function useDeleteMission(projectPk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMission(projectPk, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions", projectPk] });
    },
  });
}
