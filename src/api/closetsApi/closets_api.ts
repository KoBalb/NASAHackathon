import type { Closet } from "../../types";
import api from "../api";


export async function getClosets(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number
): Promise<Closet[]> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/`
  );
  return res.data;
}

export async function createCloset(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  data: Closet
): Promise<Closet> {
  const res = await api.post(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/`,
    data
  );
  return res.data;
}

export async function getClosetById(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetId: number
): Promise<Closet> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetId}/`
  );
  return res.data;
}

export async function updateCloset(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetId: number,
  data: Closet
): Promise<Closet> {
  const res = await api.patch(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetId}/`,
    data
  );
  return res.data;
}

export async function deleteCloset(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  closetId: number
): Promise<void> {
  await api.delete(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/closets/${closetId}/`
  );
}