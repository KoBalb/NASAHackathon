import type { Material } from "../../types";
import api from "../api";

export async function getUserMaterials(): Promise<Material[]> {
  const res = await api.get(`/api/user/materials/`);
  return res.data;
}

export async function createUserMaterial(data: Omit<Material, "id">): Promise<Material> {
  const res = await api.post(`/api/user/materials/`, data);
  return res.data;
}

export async function getUserMaterialById(id: number): Promise<Material> {
  const res = await api.get(`/api/user/materials/${id}/`);
  return res.data;
}

export async function updateUserMaterial(id: number, data: Partial<Omit<Material, "id">>): Promise<Material> {
  const res = await api.patch(`/api/user/materials/${id}/`, data);
  return res.data;
}

export async function deleteUserMaterial(id: number): Promise<void> {
  await api.delete(`/api/user/materials/${id}/`);
}
