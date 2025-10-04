import type { ValueResource } from "../../types";
import api from "../api";

export async function getModuleValueResources(
  projectPk: number,
  modulePk: number
): Promise<ValueResource[]> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/value-resource/`
  );
  return res.data;
}

export async function createModuleValueResource(
  projectPk: number,
  modulePk: number,
  data: Omit<ValueResource, "id">
): Promise<ValueResource> {
  const res = await api.post(
    `/projects/${projectPk}/modules/${modulePk}/value-resource/`,
    data
  );
  return res.data;
}

export async function getModuleValueResourceById(
  projectPk: number,
  modulePk: number,
  id: number
): Promise<ValueResource> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/value-resource/${id}/`
  );
  return res.data;
}

export async function updateModuleValueResource(
  projectPk: number,
  modulePk: number,
  id: number,
  data: Partial<Omit<ValueResource, "id">>
): Promise<ValueResource> {
  const res = await api.patch(
    `/projects/${projectPk}/modules/${modulePk}/value-resource/${id}/`,
    data
  );
  return res.data;
}
 
export async function deleteModuleValueResource(
  projectPk: number,
  modulePk: number,
  id: number
): Promise<void> {
  await api.delete(
    `/projects/${projectPk}/modules/${modulePk}/value-resource/${id}/`
  );
}
