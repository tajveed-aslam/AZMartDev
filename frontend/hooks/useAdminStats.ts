import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/admin/stats").then((r) => r.data),
    refetchInterval: 30_000,
  });
}
