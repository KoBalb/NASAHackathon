import type { Compartment } from "../../types";
import api from "../api";

export async function getCompartments(projectPk: number, modulePk: number): Promise<Compartment[]> {
  const res = await api.get(`/projects/${projectPk}/modules/${modulePk}/compartments/`);
  return res.data;
}

export async function createCompartment(projectPk: number,modulePk: number,data: Compartment): Promise<Compartment> {
  const res = await api.post(`/projects/${projectPk}/modules/${modulePk}/compartments/`, data);
  return res.data;
}

 export async function getCompartmentById(
  projectPk: number,
  modulePk: number,
  id: number
): Promise<Compartment> {
  const res = await api.get(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${id}/`
  );
  return res.data;
}

export async function updateCompartment(
  projectPk: number,
  modulePk: number,
  id: number,
  data: Compartment
): Promise<Compartment> {
  const res = await api.patch(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${id}/`,
    data
  );
  return res.data;
}

export async function deleteCompartment(
  projectPk: number,
  modulePk: number,
  id: number
): Promise<void> {
  await api.delete(
    `/projects/${projectPk}/modules/${modulePk}/compartments/${id}/`
  );
}
