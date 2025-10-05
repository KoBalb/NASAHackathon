import type { CosmonautDefaultResource } from "../../types";
import api from "../api";

// ==== API ====
export async function getDefaultResources(cosmonautId: number): Promise<CosmonautDefaultResource[]> {
  const res = await api.get(`user/cosmonauts/${cosmonautId}/default-resources/`);
  return res.data;
}

export async function createDefaultResource(
  cosmonautId: number,
  data: Omit<CosmonautDefaultResource, "id">
): Promise<CosmonautDefaultResource> {
  const res = await api.post(`user/cosmonauts/${cosmonautId}/default-resources/`, data);
  return res.data;
}

export async function getDefaultResourceById(cosmonautId: number, id: number): Promise<CosmonautDefaultResource> {
  const res = await api.get(`user/cosmonauts/${cosmonautId}/default-resources/${id}/`);
  return res.data;
}

export async function updateDefaultResource(
  cosmonautId: number,
  id: number,
  data: Partial<Omit<CosmonautDefaultResource, "id">>
): Promise<CosmonautDefaultResource> {
  const res = await api.patch(`user/cosmonauts/${cosmonautId}/default-resources/${id}/`, data);
  return res.data;
}

export async function deleteDefaultResource(cosmonautId: number, id: number): Promise<void> {
  await api.delete(`user/cosmonauts/${cosmonautId}/default-resources/${id}/`);
}