import type { TegProject } from "../../types";
import api from "../api";

export async function getTegProjects(): Promise<TegProject[]> {
  const res = await api.get(`/api/user/teg-projects/`);
  return res.data;
}

export async function createTegProject(data: Omit<TegProject, "id">): Promise<TegProject> {
  const res = await api.post(`/api/user/teg-projects/`, data);
  return res.data;
}

export async function getTegProjectById(id: number): Promise<TegProject> {
  const res = await api.get(`/api/user/teg-projects/${id}/`);
  return res.data;
}

export async function updateTegProject(id: number, data: Partial<Omit<TegProject, "id">>): Promise<TegProject> {
  const res = await api.patch(`/api/user/teg-projects/${id}/`, data);
  return res.data;
}

export async function deleteTegProject(id: number): Promise<void> {
  await api.delete(`/api/user/teg-projects/${id}/`);
}