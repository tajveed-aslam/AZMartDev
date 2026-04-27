import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Category } from "@/types";

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((r) => r.data),
    staleTime: 300_000,
  });
}
