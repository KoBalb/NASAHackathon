import type { Cosmonaut } from "../../types";
import api from "../api";

export async function getCosmonauts(): Promise<Cosmonaut[]> {
  const res = await api.get(`user/cosmonauts/`);
  return res.data;
}

export async function createCosmonaut(data: Omit<Cosmonaut, "id">): Promise<Cosmonaut> {
  const res = await api.post(`user/cosmonauts/`, data);
  return res.data;
}

export async function getCosmonautById(id: number): Promise<Cosmonaut> {
  const res = await api.get(`user/cosmonauts/${id}/`);
  return res.data;
}

export async function updateCosmonaut(id: number, data: Partial<Omit<Cosmonaut, "id">>): Promise<Cosmonaut> {
  const res = await api.patch(`user/cosmonauts/${id}/`, data);
  return res.data;
}

export async function deleteCosmonaut(id: number): Promise<void> {
  await api.delete(`user/cosmonauts/${id}/`);
}