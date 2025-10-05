import type { Teg } from "../../types";
import api from "../api";

export async function getTegs(): Promise<Teg[]> {
  const res = await api.get(`/api/user/tegs/`);
  return res.data;
}

export async function createTeg(data: Omit<Teg, "id">): Promise<Teg> {
  const res = await api.post(`/api/user/tegs/`, data);
  return res.data;
}

export async function getTegById(id: number): Promise<Teg> {
  const res = await api.get(`/api/user/tegs/${id}/`);
  return res.data;
}

export async function updateTeg(id: number, data: Partial<Omit<Teg, "id">>): Promise<Teg> {
  const res = await api.patch(`/api/user/tegs/${id}/`, data);
  return res.data;
}

export async function deleteTeg(id: number): Promise<void> {
  await api.delete(`/api/user/tegs/${id}/`);
}