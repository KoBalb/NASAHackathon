import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CatalogsDefaultValue } from "../../types";
import { getDefaultValue, updateDefaultValue } from "../../api/catalogsApi/catalogs_default_value";

export function useDefaultValue(catalogId: number) {
  return useQuery<CatalogsDefaultValue, Error>({
    queryKey: ["default-value", catalogId],
    queryFn: () => getDefaultValue(catalogId),
    enabled: !!catalogId,
  });
}

export function useUpdateDefaultValue(catalogId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Omit<CatalogsDefaultValue, "id">>) =>
      updateDefaultValue(catalogId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["default-value", catalogId] });
    },
  });
}