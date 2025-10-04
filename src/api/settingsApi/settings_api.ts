import type { ProjectSettings } from "../../types";
import api from "../api";

// получить настройки проекта (GET)
export async function getProjectSettings(id: number): Promise<ProjectSettings> {
  const res = await api.get(`/projects/${id}/settings/`);
  return res.data;
}

// обновить настройки проекта (PATCH)
export async function updateProjectSettings(
  id: number,
  data: Partial<Omit<ProjectSettings, "id" | "created_at" | "updated_at">>
): Promise<ProjectSettings> {
  const res = await api.patch(`/projects/${id}/settings/`, data);
  return res.data;
}