enum TypeEnum {
  ES, "external-systems",
  CO, "components",
  SL, "closets",
  ZN, "zones",
  CM, "compartments",
  MO, "modules",
};

export type Catalog = {
  id?: number;
  type: TypeEnum;
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
  id?: number;
  name: string;
  description: string;
  preview: string;
  teg?: string;
  created_at?: string;
  updated_at?: string;
};

export type ProjectSettings = {
  "recursive_water": number,
  "max_weight": number,
  "max_price": number
};

export interface Mission {
  id?: number,
  name: "string",
  days: 9223372036854776000,
  description: "string",
  crew_number: 9223372036854776000
}

export interface Material {
  id?: number;
  name: string;
  photo: string;
}

export interface UserResource {
  id: number;
  name: string;
  icon: string;
  measurement: string;
  limit: number;
  is_limit_type_big: boolean;
  stock: number;
  is_stock_percentage: boolean;
  is_default: boolean;
}

export interface TegProject {
  id: number;
  name: string;
}
export interface Teg {
  id: number;
  name: string;
}
