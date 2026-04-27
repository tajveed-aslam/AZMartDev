"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useOrder } from "@/hooks/useOrders";
import { formatDate, getImageUrl } from "@/lib/formatters";
import { useCurrency } from "@/hooks/useCurrency";
import { StatusBadge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";

const STEPS = [
  { key: "pending",    label: "Order Placed",  icon: "📋", desc: "We received your order" },
  { key: "processing", label: "Processing",    icon: "⚙️",  desc: "Preparing your items" },
  { key: "shipped",    label: "Shipped",       icon: "🚚", desc: "Out for delivery" },
  { key: "delivered",  label: "Delivered",     icon: "✅", desc: "Order complete!" },
];

const STATUS_INDEX: Record<string, number> = {
  pending: 0, processing: 1, shipped: 2, delivered: 3,
};

function OrderTimeline({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3">
        <span className="text-2xl">❌</span>
        <div>
          <p className="font-semibold text-red-700">Order Cancelled</p>
          <p className="text-sm text-red-500">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_INDEX[status] ?? 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span>📦</span> Order Tracking
      </h3>
      <div className="relative">
        {/* Progress bar */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 hidden sm:block">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
            style={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
          {STEPS.map((step, idx) => {
            const done    = idx < currentIdx;
            const active  = idx === currentIdx;
            const pending = idx > currentIdx;

            return (
              <div key={step.key} className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0 relative">
                {/* Circle */}
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-lg flex-shrink-0 transition-all duration-300 ${
                  done
                    ? "bg-gradient-to-br from-indigo-500 to-violet-500 shadow-md shadow-indigo-200"
                    : active
                    ? "bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-300 ring-4 ring-indigo-100"
                    : "bg-gray-100 border-2 border-gray-200"
                }`}>
                  {done ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className={active ? "animate-pulse" : "grayscale opacity-50"}>{step.icon}</span>
                  )}
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-indigo-400 animate-ping opacity-20" />
                  )}
                </div>

                {/* Label */}
                <div className={`sm:mt-3 sm:text-center flex-1 sm:flex-none ${pending ? "opacity-40" : ""}`}>
                  <p className={`text-xs font-bold ${active ? "text-indigo-600" : done ? "text-gray-700" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(Number(id));
  const { format } = useCurrency();

  if (isLoading) return <PageLoader />;
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/account/orders" className="text-gray-400 hover:text-indigo-600 transition text-sm font-medium">
          ← Back to Orders
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-5">
        {/* Tracking Timeline */}
        <OrderTimeline status={order.status} />

        {/* Items */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                  {item.product_image && (
                    <Image src={getImageUrl(item.product_image)} alt={item.product_name} fill className="object-cover" sizes="56px" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{item.product_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Qty {item.quantity} &times; {format(item.unit_price)}</p>
                </div>
                <span className="font-bold text-gray-900 text-sm">{format(item.unit_price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-4 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span className="text-indigo-600">{format(order.total_amount)}</span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Delivery Details</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-xl p-3"><dt className="text-gray-400 text-xs mb-1">Name</dt><dd className="font-semibold text-gray-800">{order.full_name}</dd></div>
            <div className="bg-gray-50 rounded-xl p-3"><dt className="text-gray-400 text-xs mb-1">Phone</dt><dd className="font-semibold text-gray-800">{order.phone}</dd></div>
            <div className="bg-gray-50 rounded-xl p-3"><dt className="text-gray-400 text-xs mb-1">City</dt><dd className="font-semibold text-gray-800">{order.city}</dd></div>
            <div className="bg-gray-50 rounded-xl p-3"><dt className="text-gray-400 text-xs mb-1">Order Date</dt><dd className="font-semibold text-gray-800">{formatDate(order.created_at)}</dd></div>
            <div className="sm:col-span-2 bg-gray-50 rounded-xl p-3"><dt className="text-gray-400 text-xs mb-1">Address</dt><dd className="font-semibold text-gray-800">{order.address}</dd></div>
            {order.notes && (
              <div className="sm:col-span-2 bg-gray-50 rounded-xl p-3"><dt className="text-gray-400 text-xs mb-1">Notes</dt><dd className="font-semibold text-gray-800">{order.notes}</dd></div>
            )}
          </dl>
        </div>

        {/* Payment */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">💵</div>
            <div>
              <p className="font-bold text-amber-800">Cash on Delivery</p>
              <p className="text-sm text-amber-600">Pay <strong>{format(order.total_amount)}</strong> when your order arrives.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
