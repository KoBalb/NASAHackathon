import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Closet } from "../../types";
import { createCloset, deleteCloset, getClosetById, getClosets, updateCloset } from "../../api/closetsApi/closets_api";

export function useClosets(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number
) {
  return useQuery<Closet[], Error>({
    queryKey: ["closets", projectPk, modulePk, compartmentPk, zonePk],
    queryFn: () => getClosets(projectPk, modulePk, compartmentPk, zonePk),
    enabled: !!projectPk && !!modulePk && !!compartmentPk && !!zonePk,
  });
}

// один шкаф
export function useCloset(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetId: number
) {
  return useQuery<Closet, Error>({
    queryKey: ["closets", projectPk, modulePk, compartmentPk, zonePk, closetId],
    queryFn: () => getClosetById(projectPk, modulePk, compartmentPk, zonePk, closetId),
    enabled: !!closetId,
  });
}

// создание
export function useCreateCloset(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Closet) =>
      createCloset(projectPk, modulePk, compartmentPk, zonePk, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["closets", projectPk, modulePk, compartmentPk, zonePk],
      });
    },
  });
}

// обновление
export function useUpdateCloset(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetId: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Closet) =>
      updateCloset(projectPk, modulePk, compartmentPk, zonePk, closetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["closets", projectPk, modulePk, compartmentPk, zonePk],
      });
      queryClient.invalidateQueries({
        queryKey: ["closets", projectPk, modulePk, compartmentPk, zonePk, closetId],
      });
    },
  });
}

// удаление
export function useDeleteCloset(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetId: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      deleteCloset(projectPk, modulePk, compartmentPk, zonePk, closetId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["closets", projectPk, modulePk, compartmentPk, zonePk],
      });
    },
  });
}