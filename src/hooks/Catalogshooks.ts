import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Catalog } from "../types";
import { createCatalog, deleteCatalog, getCatalogById, getCatalogs, updateCatalog } from "../api/catalogsApi/catalogs_api";

export const useCatalogsQuery = () =>
  useQuery<Catalog[], Error>({
    queryKey: ["catalogs"],
    queryFn: getCatalogs,
  });

  export const useCatalogById = (id: number) =>
  useQuery<Catalog, Error>({
    queryKey: ["catalog", id],
    queryFn: () => getCatalogById(id),
    enabled: !!id, 
  });

export const useAddCatalog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createCatalog(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["catalogs"]}),
  });
};

export const useUpdateCatalog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Catalog, "id">> }) =>
      updateCatalog(id, data),
    onSuccess: (_, { id }) => queryClient.invalidateQueries({ queryKey: ["catalogs", id]}),
  });
};

export const useDeleteCatalog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCatalog(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["catalogs"]}),
  });
};