import type { Zone } from "../../types";
import api from "../api";

export async function getZones(
  projectPk: number,
  modulePk: number,
  compartmentPk: number
): Promise<Zone[]> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/`
  );
  return res.data;
}

export async function createZone(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  data: Zone
): Promise<Zone> {
  const res = await api.post(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/`,
    data
  );
  return res.data;
}

export async function getZoneById(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  id: number
): Promise<Zone> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${id}/`
  );
  return res.data;
}

export async function updateZone(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  id: number,
  data: Zone
): Promise<Zone> {
  const res = await api.patch(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${id}/`,
    data
  );
  return res.data;
}

export async function deleteZone(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  id: number
): Promise<void> {
  await api.delete(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${id}/`
  );
}