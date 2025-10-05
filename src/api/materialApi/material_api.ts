import type { Material } from "../../types";
import api from "../api";

export async function getUserMaterials(): Promise<Material[]> {
  const res = await api.get(`user/materials/`);
  return res.data;
}

export async function createUserMaterial(data: Omit<Material, "id">): Promise<Material> {
  const res = await api.post(`user/materials/`, data);
  return res.data;
}

export async function getUserMaterialById(id: number): Promise<Material> {
  const res = await api.get(`user/materials/${id}/`);
  return res.data;
}

export async function updateUserMaterial(id: number, data: Partial<Omit<Material, "id">>): Promise<Material> {
  const res = await api.patch(`user/materials/${id}/`, data);
  return res.data;
}

export async function deleteUserMaterial(id: number): Promise<void> {
  await api.delete(`user/materials/${id}/`);
}
