import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Product, ProductFilters, ProductListOut } from "@/types";

export function useProducts(filters: ProductFilters = {}) {
  return useQuery<ProductListOut>({
    queryKey: ["products", filters],
    queryFn: () =>
      api.get("/products", { params: filters }).then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useProduct(id: number) {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => api.get(`/products/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}
