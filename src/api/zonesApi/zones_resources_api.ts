import type { ValueResource } from "../../types";
import api from "../api";

export async function getZoneValueResources(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number
): Promise<ValueResource[]> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/value-resource/`
  );
  return res.data;
}

export async function createZoneValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  data: Omit<ValueResource, "id">
): Promise<ValueResource> {
  const res = await api.post(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/value-resource/`,
    data
  );
  return res.data;
}

export async function getZoneValueResourceById(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  id: number
): Promise<ValueResource> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/value-resource/${id}/`
  );
  return res.data;
}

export async function updateZoneValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  id: number,
  data: Partial<Omit<ValueResource, "id">>
): Promise<ValueResource> {
  const res = await api.patch(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/value-resource/${id}/`,
    data
  );
  return res.data;
}

export async function deleteZoneValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  id: number
): Promise<void> {
  await api.delete(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/value-resource/${id}/`
  );
}