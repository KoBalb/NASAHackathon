import type { Project } from "../../types";
import api from "../api";

// список (GET)
export async function getProjects(): Promise<Project[]> {
  const res = await api.get("/projects/");
  return res.data;
}

// создать (POST)
export async function createProject(
  data: Omit<Project, "id" | "created_at" | "updated_at">
): Promise<Project> {
  const res = await api.post("/projects/", data);
  return res.data;
}

// один проект (GET)
export async function getProjectById(id: number): Promise<Project> {
  const res = await api.get(`/projects/${id}/`);
  return res.data;
}

// обновить (PATCH)
export async function updateProject(
  id: number,
  data: Partial<Omit<Project, "id" | "created_at" | "updated_at">>
): Promise<Project> {
  const res = await api.patch(`/projects/${id}/`, data);
  return res.data;
}

// удалить (DELETE)
export async function deleteProject(id: number): Promise<void> {
  await api.delete(`/projects/${id}/`);
}