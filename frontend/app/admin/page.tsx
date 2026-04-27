"use client";
import { useAdminStats } from "@/hooks/useAdminStats";
import { formatPKR, formatDate } from "@/lib/formatters";
import { StatusBadge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";
import type { AdminOrder } from "@/types";

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className={`rounded-2xl p-6 text-white ${color}`}>
      <div className="text-3xl mb-3">{icon}</div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm opacity-80 mt-1">{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon="💰" label="Total Revenue" value={formatPKR(stats?.total_revenue || 0)} color="bg-primary" />
        <StatCard icon="🛍️" label="Total Orders"  value={String(stats?.total_orders || 0)}     color="bg-emerald-600" />
        <StatCard icon="👥" label="Customers"      value={String(stats?.total_users || 0)}      color="bg-amber-500" />
        <StatCard icon="📦" label="Products"       value={String(stats?.total_products || 0)}   color="bg-purple-600" />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-5 py-3">Order</th>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(stats?.recent_orders || []).map((order: AdminOrder) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium">#{order.id}</td>
                  <td className="px-5 py-3 text-gray-600">{order.user_name || order.full_name}</td>
                  <td className="px-5 py-3 text-gray-400">{formatDate(order.created_at)}</td>
                  <td className="px-5 py-3 font-semibold">{formatPKR(order.total_amount)}</td>
                  <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
