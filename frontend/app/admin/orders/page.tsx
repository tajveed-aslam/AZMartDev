"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useUIStore } from "@/store/uiStore";
import { formatPKR, formatDate } from "@/lib/formatters";
import { PageLoader } from "@/components/ui/Spinner";
import { ORDER_STATUSES } from "@/lib/constants";
import type { AdminOrder } from "@/types";

export default function AdminOrdersPage() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", page],
    queryFn: () => api.get("/admin/orders", { params: { page, page_size: 15 } }).then((r) => r.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.patch(`/admin/orders/${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      addToast("Order status updated");
    },
    onError: () => addToast("Failed to update status", "error"),
  });

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-5 py-3">Order</th>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">City</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Total</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(data?.items || []).map((order: AdminOrder) => (
                <>
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  >
                    <td className="px-5 py-3 font-medium">#{order.id}</td>
                    <td className="px-5 py-3 text-gray-600">
                      <div>{order.user_name || order.full_name}</div>
                      <div className="text-xs text-gray-400">{order.user_email}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{order.city}</td>
                    <td className="px-5 py-3 text-gray-400">{formatDate(order.created_at)}</td>
                    <td className="px-5 py-3 font-semibold">{formatPKR(order.total_amount)}</td>
                    <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
                        className="text-xs border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr key={`${order.id}-expanded`}>
                      <td colSpan={6} className="px-5 py-3 bg-gray-50">
                        <div className="text-sm space-y-1">
                          <p className="text-gray-500 font-medium mb-2">Order Items</p>
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-gray-600">
                              <span>{item.product_name} x{item.quantity}</span>
                              <span className="font-medium">{formatPKR(item.unit_price * item.quantity)}</span>
                            </div>
                          ))}
                          <div className="pt-2 border-t text-gray-500 text-xs">
                            📍 {order.address}, {order.city} · 📞 {order.phone}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {(data?.pages || 1) > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40">← Prev</button>
            <span className="text-sm text-gray-600">Page {page} of {data?.pages}</span>
            <button onClick={() => setPage((p) => Math.min(data?.pages, p + 1))} disabled={page === data?.pages} className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
