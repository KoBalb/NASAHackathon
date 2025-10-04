export const Enum = {
  ES: "external systems",
  CO: "components",
  SL: "closets",
  ZN: "zones",
  CM: "compartments",
  MO: "modules",
};

export type Catalog = {
  id?: number;
  type: string;
  name: string;
  photo: string;
  teg: number;
};

export type ExternalSystem = {
  id?: number;
  orient: number;
  w: number;
  h: number;
  d: number;
  name: string;
  price: number;
  weight: number;
  comment: string;
  x: number;
  y: number;
  z: number;
  catalog: number;
  project: number;
};

export type Module = {
  id?: number;
  orient: number;
  w: number;
  h: number;
  name: string;
  price: number;
  weight: number;
  comment: string;
  x: number;
  y: number;
  z: number;
  owner: string;
  catalog: number;
  project: number;
  material: number;
};

export interface Compartment {
  id?: number;
  w: number;
  h: number;
  d: number;
  name: string;
  price: number;
  weight: number;
  comment: string;
  x: number;
  y: number;
  z: number;
  catalog: number;
  project: number;
  module: number;
}

export type Zone = {
  id?: number;
  w: number;
  h: number;
  d: number;
  name: string;
  price: number;
  weight: number;
  comment: string;
  x: number;
  y: number;
  z: number;
  catalog: number;
  project: number;
  compartment: number;
};

export type Closet = {
  id?: number;      
  w: number;
  h: number;
  d: number;
  name: string;
  price: number;
  weight: number;
  comment: string;
  x: number;
  y: number;
  z: number;
  catalog: number;
  project: number;
  zone: number;
};

export type InnerComponent = {
  id: number;
  orient: number;
  w: number;
  h: number;
  d: number;
  name: string;
  price: number;
  weight: number;
  comment: string;
  x: number;
  y: number;
  z: number;
  catalog: number;
  project: number;
  closets: number;
};

export interface Component {
  id: number;
  orient: number;
  w: number;
  h: number;
  d: number;
  name: string;
  price: number;
  weight: number;
  comment: string;
  x: number;
  y: number;
  z: number;
  catalog: number;
  project: number;
  zone: number;
}

export type ValueResource = {
  id: number;
  resource: number;
  value: number;
  is_disposable: boolean;
};

export type CatalogsDefaultValue = {
  id: number;
  type: string;
  name: string;
  photo: string;
  teg: number;
  is_default: boolean;
};

export type ExternalSystemsResources = {
  id: number;
  value: number;
  is_disposable: boolean;
  resource: number;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  preview: string;
  created_at: string;
  updated_at: string;
};
