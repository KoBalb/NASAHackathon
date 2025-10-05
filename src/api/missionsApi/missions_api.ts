import type { Mission } from "../../types";
import api from "../api";

export async function getMissions(projectPk: number): Promise<Mission[]> {
  const res = await api.get(`projects/${projectPk}/missions/`);
  return res.data;
}

export async function createMission(projectPk: number, data: Omit<Mission, "id">): Promise<Mission> {
  const res = await api.post(`projects/${projectPk}/missions/`, data);
  return res.data;
}

export async function getMissionById(projectPk: number, id: number): Promise<Mission> {
  const res = await api.get(`projects/${projectPk}/missions/${id}/`);
  return res.data;
}

export async function updateMission(projectPk: number, id: number, data: Partial<Omit<Mission, "id">>): Promise<Mission> {
  const res = await api.patch(`projects/${projectPk}/missions/${id}/`, data);
  return res.data;
}

export async function deleteMission(projectPk: number, id: number): Promise<void> {
  await api.delete(`projects/${projectPk}/missions/${id}/`);
}