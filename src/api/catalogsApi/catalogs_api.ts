import api from "../api";
import type { Catalog } from "../../types";

export const getCatalogs = async (): Promise<Catalog[]> => {
  const res = await api.get<Catalog[]>("/user/catalogs/");
  return res.data;
};

export const createCatalog = async (data: FormData): Promise<Omit<Catalog, "id">> => {
  const res = await api.post<Catalog>("/user/catalogs/", data);
  return res.data;
}

export const getCatalogById = async (id: number): Promise<Catalog> => {
  const res = await api.get<Catalog>(`/user/catalogs/${id}/`);
  return res.data;
};

export const updateCatalog = async (
  id: number,
  data: Partial<Omit<Catalog, "id">>
): Promise<Catalog> => {
  const res = await api.patch<Catalog>(`/user/catalogs/${id}/`, data);
  return res.data;
};

export const deleteCatalog = async (id: number): Promise<void> => {
  await api.delete(`/user/catalogs/${id}/`);
}

