import type { ValueResource } from "../../types";
import api from "../api";


export async function getComponentValueResources(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  componentPk: number
): Promise<ValueResource[]> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/components/${componentPk}/value-resource/`
  );
  return res.data;
}

export async function createComponentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  componentPk: number,
  data: Omit<ValueResource, "id">
): Promise<ValueResource> {
  const res = await api.post(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/components/${componentPk}/value-resource/`,
    data
  );
  return res.data;
}

export async function getComponentValueResourceById(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  componentPk: number,
  id: number
): Promise<ValueResource> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/components/${componentPk}/value-resource/${id}/`
  );
  return res.data;
}

export async function updateComponentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  componentPk: number,
  id: number,
  data: Partial<Omit<ValueResource, "id">>
): Promise<ValueResource> {
  const res = await api.patch(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/components/${componentPk}/value-resource/${id}/`,
    data
  );
  return res.data;
}

export async function deleteComponentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  componentPk: number,
  id: number
): Promise<void> {
  await api.delete(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/components/${componentPk}/value-resource/${id}/`
  );
}