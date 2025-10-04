import type { Module } from "../../types";
import api from "../api";

export async function getModules(projectPk: number): Promise<Module[]> {
  const res = await api.get(`/projects/${projectPk}/modules/`);
  return res.data;
}

export async function createModule(projectPk: number, data: Module): Promise<Module> {
  const res = await api.post(`/projects/${projectPk}/modules/`, data);
  return res.data;
}

export async function getModule(
  projectPk: number,
  id: number
): Promise<Module> {
  const res = await api.get(`/projects/${projectPk}/modules/${id}/`);
  return res.data;
}

export async function updateModule(
  projectPk: number,
  id: number,
  data: Module
): Promise<Module> {
  const res = await api.patch(`/projects/${projectPk}/modules/${id}/`, data);
  return res.data;
}

export async function deleteModule(projectPk: number, id: number): Promise<void> {
  await api.delete(`/projects/${projectPk}/modules/${id}/`);
}