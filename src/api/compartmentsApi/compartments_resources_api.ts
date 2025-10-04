import type { ValueResource } from "../../types";
import api from "../api";

export async function getCompartmentValueResources(
  projectPk: number,
  modulePk: number,
  compartmentPk: number
): Promise<ValueResource[]> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/value-resource/`
  );
  return res.data;
}

export async function createCompartmentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  data: Omit<ValueResource, "id">
): Promise<ValueResource> {
  const res = await api.post(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/value-resource/`,
    data
  );
  return res.data;
}

export async function getCompartmentValueResourceById(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  id: number
): Promise<ValueResource> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/value-resource/${id}/`
  );
  return res.data;
}

export async function updateCompartmentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  id: number,
  data: Partial<Omit<ValueResource, "id">>
): Promise<ValueResource> {
  const res = await api.patch(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/value-resource/${id}/`,
    data
  );
  return res.data;
}

export async function deleteCompartmentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  id: number
): Promise<void> {
  await api.delete(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/value-resource/${id}/`
  );
}