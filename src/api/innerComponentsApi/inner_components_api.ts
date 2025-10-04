import type { InnerComponent } from "../../types";
import api from "../api";

export async function getInnerComponents(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number
): Promise<InnerComponent[]> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetPk}/inner-components/`
  );
  return res.data;
}

export async function createInnerComponent(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  data: InnerComponent
): Promise<InnerComponent> {
  const res = await api.post(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetPk}/inner-components/`,
    data
  );
  return res.data;
}

export async function getInnerComponentById(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  id: number
): Promise<InnerComponent> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetPk}/inner-components/${id}/`
  );
  return res.data;
}

export async function updateInnerComponent(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  id: number,
  data: InnerComponent
): Promise<InnerComponent> {
  const res = await api.patch(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetPk}/inner-components/${id}/`,
    data
  );
  return res.data;
}


export async function deleteInnerComponent(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetPk: number,
  innerComponentId: number
): Promise<void> {
  await api.delete(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetPk}/inner-components/${innerComponentId}/`
  );
}