

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

export type Project = {
  id: number;
  name: string;
  description: string;
  preview: string;
  created_at: string;
  updated_at: string;
};
