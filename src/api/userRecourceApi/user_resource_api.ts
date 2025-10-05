import type { UserResource } from "../../types";
import api from "../api";


export async function getUserResources(): Promise<UserResource[]> {
  const res = await api.get(`/api/user/resources/`);
  return res.data;
}

export async function createUserResource(data: Omit<UserResource, "id">): Promise<UserResource> {
  const res = await api.post(`/api/user/resources/`, data);
  return res.data;
}

export async function getUserResourceById(id: number): Promise<UserResource> {
  const res = await api.get(`/api/user/resources/${id}/`);
  return res.data;
}

export async function updateUserResource(id: number, data: Partial<Omit<UserResource, "id">>): Promise<UserResource> {
  const res = await api.patch(`/api/user/resources/${id}/`, data);
  return res.data;
}

export async function deleteUserResource(id: number): Promise<void> {
  await api.delete(`/api/user/resources/${id}/`);
}
