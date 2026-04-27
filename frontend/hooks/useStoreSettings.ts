import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { StoreSettings } from "@/types";

export function useStoreSettings() {
  return useQuery<StoreSettings>({
    queryKey: ["store-settings"],
    queryFn: () => api.get("/settings").then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateStoreSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<StoreSettings>) => api.put("/settings", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["store-settings"] }),
  });
}
