import type { ValueResource } from "../../types";
import api from "../api";


export async function getDefaultResources(catalogPk: number): Promise<ValueResource[]> {
  const res = await api.get(`/user/catalogs/${catalogPk}/default-resources/`);
  return res.data;
}

export async function createDefaultResource(
  catalogPk: number,
  data: Omit<ValueResource, "id">
): Promise<ValueResource> {
  const res = await api.post(`/user/catalogs/${catalogPk}/default-resources/`, data);
  return res.data;
}

export async function getDefaultResourceId(
  catalogPk: number,
  id: number
): Promise<ValueResource> {
  const res = await api.get(`/user/catalogs/${catalogPk}/default-resources/${id}/`);
  return res.data;
}

export async function createDefaultResourceId(
  catalogPk: number,
  id: number,
  data: Omit<ValueResource, "id">
): Promise<ValueResource> {
  const res = await api.post(`/user/catalogs/${catalogPk}/default-resources/${id}/`, data);
  return res.data;
}

export async function updateDefaultResource(
  catalogPk: number,
  id: number,
  data: Partial<Omit<ValueResource, "id">>
): Promise<ValueResource> {
  const res = await api.patch(`/user/catalogs/${catalogPk}/default-resources/${id}/`, data);
  return res.data;
}

export async function deleteDefaultResource(
  catalogPk: number,
  id: number
): Promise<void> {
  await api.delete(`/user/catalogs/${catalogPk}/default-resources/${id}/`);
}