import type { ExternalSystem } from "../../types";
import api from "../api";

export async function getExternalSystems(projectPk: string): Promise<ExternalSystem[]> {
  const res = await api.get(`/projects/${projectPk}/external-systems/`);
  return res.data;
}

export async function createExternalSystem( projectPk: string, data: ExternalSystem) {
  const res = await api.post(`/projects/${projectPk}/external-systems/`, data);
  return res.data;
}

export async function getExternalSystemById(projectPk: string,id: number): Promise<ExternalSystem> {
  const res = await api.get(`/projects/${projectPk}/external-systems/${id}/`);
  return res.data;
}

export async function updateExternalSystem(projectPk: string,id: number,data: ExternalSystem): Promise<ExternalSystem> {
  const res = await api.patch(`/projects/${projectPk}/external-systems/${id}/`, data);
  return res.data;
}

export async function deleteExternalSystem(projectPk: string,id: number): Promise<void> {
  await api.delete(`/projects/${projectPk}/external-systems/${id}/`);
}