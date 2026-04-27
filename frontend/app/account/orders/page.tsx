"use client";
import Link from "next/link";
import { useOrders } from "@/hooks/useOrders";
import { formatDate } from "@/lib/formatters";
import { useCurrency } from "@/hooks/useCurrency";
import { StatusBadge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();
  const { format } = useCurrency();

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

      {!orders?.length ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-lg font-medium">No orders yet</p>
          <p className="text-sm mt-1 mb-6">Start shopping to see your orders here</p>
          <Link href="/products"><Button>Shop Now</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`}
              className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-primary hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-semibold text-gray-900">Order #{order.id}</span>
                  <span className="text-gray-400 text-sm ml-3">{formatDate(order.created_at)}</span>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="text-sm text-gray-500">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {order.city}
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-400">{order.items.map((i) => i.product_name).join(", ")}</span>
                <span className="font-bold text-gray-900">{format(order.total_amount)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
