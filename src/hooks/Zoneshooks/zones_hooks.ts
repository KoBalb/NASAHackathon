import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createZone, deleteZone, getZoneById, getZones, updateZone } from "../../api/zonesApi/zones_api";
import type { Zone } from "../../types";

export function useZones(projectPk: number, modulePk: number, compartmentPk: number) {
  return useQuery({
    queryKey: ["zones", projectPk, modulePk, compartmentPk],
    queryFn: () => getZones(projectPk, modulePk, compartmentPk),
    enabled: !!projectPk && !!modulePk && !!compartmentPk,
  });
}

export function useZone(projectPk: number, modulePk: number, compartmentPk: number, id: number) {
  return useQuery({
    queryKey: ["zone", projectPk, modulePk, compartmentPk, id],
    queryFn: () => getZoneById(projectPk, modulePk, compartmentPk, id),
    enabled: !!id,
  });
}

export function useCreateZone(projectPk: number, modulePk: number, compartmentPk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Zone) => createZone(projectPk, modulePk, compartmentPk, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones", projectPk, modulePk, compartmentPk] });
    },
  });
}

export function useUpdateZone(projectPk: number, modulePk: number, compartmentPk: number, id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Zone) => updateZone(projectPk, modulePk, compartmentPk, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zone", projectPk, modulePk, compartmentPk, id] });
      queryClient.invalidateQueries({ queryKey: ["zones", projectPk, modulePk, compartmentPk] });
    },
  });
}

export function useDeleteZone(projectPk: number, modulePk: number, compartmentPk: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteZone(projectPk, modulePk, compartmentPk, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones", projectPk, modulePk, compartmentPk] });
    },
  });
}