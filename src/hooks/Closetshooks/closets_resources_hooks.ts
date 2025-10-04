import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ValueResource } from "../../types";
import { createClosetValueResource, deleteClosetValueResource, getClosetValueResourceById, getClosetValueResources, updateClosetValueResource } from "../../api/closetsApi/closets_resources_api";


// список value-resources в closet
export function useClosetValueResources(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number
) {
  return useQuery<ValueResource[], Error>({
    queryKey: ["closet-value-resources", projectPk, modulePk, compartmentPk, zonePk, closetPk],
    queryFn: () =>
      getClosetValueResources(projectPk, modulePk, compartmentPk, zonePk, closetPk),
    enabled: !!closetPk,
  });
}

// один value-resource
export function useClosetValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  id: number
) {
  return useQuery<ValueResource, Error>({
    queryKey: ["closet-value-resources", projectPk, modulePk, compartmentPk, zonePk, closetPk, id],
    queryFn: () =>
      getClosetValueResourceById(projectPk, modulePk, compartmentPk, zonePk, closetPk, id),
    enabled: !!id,
  });
}

// создание
export function useCreateClosetValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ValueResource, "id">) =>
      createClosetValueResource(projectPk, modulePk, compartmentPk, zonePk, closetPk, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["closet-value-resources", projectPk, modulePk, compartmentPk, zonePk, closetPk],
      });
    },
  });
}

// обновление
export function useUpdateClosetValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  id: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<ValueResource, "id">>) =>
      updateClosetValueResource(projectPk, modulePk, compartmentPk, zonePk, closetPk, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["closet-value-resources", projectPk, modulePk, compartmentPk, zonePk, closetPk],
      });
      queryClient.invalidateQueries({
        queryKey: ["closet-value-resources", projectPk, modulePk, compartmentPk, zonePk, closetPk, id],
      });
    },
  });
}

// удаление
export function useDeleteClosetValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  id: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      deleteClosetValueResource(projectPk, modulePk, compartmentPk, zonePk, closetPk, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["closet-value-resources", projectPk, modulePk, compartmentPk, zonePk, closetPk],
      });
    },
  });
}