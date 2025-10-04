import type { Component } from "../../types";
import api from "../api";

export async function getComponents(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number
): Promise<Component[]> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/components/`
  );
  return res.data;
}

export async function createComponent(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  data: Component
): Promise<Component> {
  const res = await api.post(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/components/`,
    data
  );
  return res.data;
}

export async function getComponentById(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  id: number
): Promise<Component> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/components/${id}/`
  );
  return res.data;
}

export async function updateComponent(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  id: number,
  data: Component
): Promise<Component> {
  const res = await api.patch(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/components/${id}/`,
    data
  );
  return res.data;
}

export async function deleteComponent(
  projectPk: number,
  modulePk: number,
  compartmentPk: number,
  zonePk: number,
  id: number
): Promise<void> {
  await api.delete(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${compartmentPk}/zones/${zonePk}/components/${id}/`
  );
}