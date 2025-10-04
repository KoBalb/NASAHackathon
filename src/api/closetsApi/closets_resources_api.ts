import type { ValueResource } from "../../types";
import api from "../api";

export async function getClosetValueResources(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number
): Promise<ValueResource[]> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetPk}/value-resource/`
  );
  return res.data;
}

export async function createClosetValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  data: Omit<ValueResource, "id">
): Promise<ValueResource> {
  const res = await api.post(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetPk}/value-resource/`,
    data
  );
  return res.data;
}

export async function getClosetValueResourceById(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  id: number
): Promise<ValueResource> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetPk}/value-resource/${id}/`
  );
  return res.data;
}

export async function updateClosetValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  id: number,
  data: Partial<Omit<ValueResource, "id">>
): Promise<ValueResource> {
  const res = await api.patch(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetPk}/value-resource/${id}/`,
    data
  );
  return res.data;
}

export async function deleteClosetValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  id: number
): Promise<void> {
  await api.delete(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetPk}/value-resource/${id}/`
  );
}