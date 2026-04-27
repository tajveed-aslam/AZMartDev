import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Order } from "@/types";

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: () => api.get("/orders").then((r) => r.data),
  });
}

export function useOrder(id: number) {
  return useQuery<Order>({
    queryKey: ["order", id],
    queryFn: () => api.get(`/orders/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}
