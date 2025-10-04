import type { ValueResource } from "../../types";
import api from "../api";

export async function getInnerComponentValueResources(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  innerComponentPk: number
): Promise<ValueResource[]> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetPk}/inner-components/${innerComponentPk}/value-resource/`
  );
  return res.data;
}

export async function createInnerComponentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  innerComponentPk: number,
  data: Omit<ValueResource, "id">
): Promise<ValueResource> {
  const res = await api.post(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetPk}/inner-components/${innerComponentPk}/value-resource/`,
    data
  );
  return res.data;
}

export async function getInnerComponentValueResourceById(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  innerComponentPk: number,
  id: number
): Promise<ValueResource> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetPk}/inner-components/${innerComponentPk}/value-resource/${id}/`
  );
  return res.data;
}

export async function updateInnerComponentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  innerComponentPk: number,
  id: number,
  data: Partial<Omit<ValueResource, "id">>
): Promise<ValueResource> {
  const res = await api.patch(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetPk}/inner-components/${innerComponentPk}/value-resource/${id}/`,
    data
  );
  return res.data;
}

export async function deleteInnerComponentValueResource(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  innerComponentPk: number,
  id: number
): Promise<void> {
  await api.delete(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetPk}/inner-components/${innerComponentPk}/value-resource/${id}/`
  );
}