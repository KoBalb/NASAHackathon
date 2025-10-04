import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createZoneValueResource, deleteZoneValueResource, getZoneValueResourceById, getZoneValueResources, updateZoneValueResource } from "../../api/zonesApi/zones_resources_api";
import type { ValueResource } from "../../types";

export function useZoneValueResources(projectPk: number, modulePk: number, compartmentPk: number, zonePk: number) {
  return useQuery({
    queryKey: ["zone-value-resources", projectPk, modulePk, compartmentPk, zonePk],
    queryFn: () => getZoneValueResources(projectPk, modulePk, compartmentPk, zonePk),
    enabled: !!projectPk && !!modulePk && !!compartmentPk && !!zonePk,
  });
}

export function useZoneValueResource(projectPk: number, modulePk: number, compartmentPk: number, zonePk: number, id: number) {
  return useQuery({
    queryKey: ["zone-value-resource", projectPk, modulePk, compartmentPk, zonePk, id],
    queryFn: () => getZoneValueResourceById(projectPk, modulePk, compartmentPk, zonePk, id),
    enabled: !!id,
  });
}

export function useCreateZoneValueResource(projectPk: number, modulePk: number, compartmentPk: number, zonePk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ValueResource, "id">) => createZoneValueResource(projectPk, modulePk, compartmentPk, zonePk, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zone-value-resources", projectPk, modulePk, compartmentPk, zonePk] });
    },
  });
}

export function useUpdateZoneValueResource(projectPk: number, modulePk: number, compartmentPk: number, zonePk: number, id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<ValueResource, "id">>) => updateZoneValueResource(projectPk, modulePk, compartmentPk, zonePk, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zone-value-resource", projectPk, modulePk, compartmentPk, zonePk, id] });
      queryClient.invalidateQueries({ queryKey: ["zone-value-resources", projectPk, modulePk, compartmentPk, zonePk] });
    },
  });
}

export function useDeleteZoneValueResource(projectPk: number, modulePk: number, compartmentPk: number, zonePk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteZoneValueResource(projectPk, modulePk, compartmentPk, zonePk, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zone-value-resources", projectPk, modulePk, compartmentPk, zonePk] });
    },
  });
}