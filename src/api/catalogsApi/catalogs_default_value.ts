import type { CatalogsDefaultValue } from "../../types";
import api from "../api";

export async function getDefaultValue(catalogId: number): Promise<CatalogsDefaultValue> {
  const res = await api.get(`/user/catalogs/${catalogId}/default-value/`);
  return res.data;
}

export async function updateDefaultValue(
  catalogId: number,
  data: Partial<Omit<CatalogsDefaultValue, "id">>
): Promise<CatalogsDefaultValue> {
  const res = await api.patch(`/user/catalogs/${catalogId}/default-value/`, data);
  return res.data;
}