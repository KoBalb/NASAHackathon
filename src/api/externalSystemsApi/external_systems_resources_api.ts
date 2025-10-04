
import type { ValueResource } from "../../types";
import api from "../api";

export async function getExternalSystemsResources(
  projectPk: number,
  externalSystemPk: number
): Promise<ValueResource[]> {
  const res = await api.get(
    `/projects/${projectPk}/external-systems/${externalSystemPk}/value-resource/`
  );
  return res.data;
}

export async function createExternalSystemsResource(
  projectPk: number,
  externalSystemPk: number,
  data: Omit<ValueResource, "id">
): Promise<ValueResource> {
  const res = await api.post(
    `/projects/${projectPk}/external-systems/${externalSystemPk}/value-resource/`,
    data
  );
  return res.data;
}

export async function getExternalSystemsResourceById(
  projectPk: number,
  externalSystemPk: number,
  id: number
): Promise<ValueResource> {
  const res = await api.get(
    `/projects/${projectPk}/external-systems/${externalSystemPk}/value-resource/${id}/`
  );
  return res.data;
}

export async function updateExternalSystemsResource(
  projectPk: number,
  externalSystemPk: number,
  id: number,
  data: Partial<Omit<ValueResource, "id">>
): Promise<ValueResource> {
  const res = await api.patch(
    `/projects/${projectPk}/external-systems/${externalSystemPk}/value-resource/${id}/`,
    data
  );
  return res.data;
}

export async function deleteExternalSystemsResource(
  projectPk: number,
  externalSystemPk: number,
  id: number
): Promise<void> {
  await api.delete(
    `/projects/${projectPk}/external-systems/${externalSystemPk}/value-resource/${id}/`
  );
}