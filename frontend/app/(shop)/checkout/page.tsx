"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { formatPKR, getImageUrl } from "@/lib/formatters";
import { useCurrency } from "@/hooks/useCurrency";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

const schema = z.object({
  full_name: z.string().min(2, "Full name required"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Full address required"),
  city: z.string().min(2, "City required"),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function OrderSuccess({ orderId, total }: { orderId: number; total: number }) {
  const { format } = useCurrency();
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✅</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Order Placed!</h2>
      <p className="text-gray-500 mb-2">Your order <strong>#{orderId}</strong> has been received.</p>
      <p className="text-gray-500 mb-8">Total: <strong>{format(total)}</strong> — Cash on Delivery.</p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link href="/account/orders"><Button variant="secondary">View My Orders</Button></Link>
        <Link href="/products"><Button>Continue Shopping</Button></Link>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const addToast = useUIStore((s) => s.addToast);
  const { format, code } = useCurrency();
  const [submitting, setSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<{ id: number; total: number } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: user?.full_name || "" },
  });

  if (items.length === 0 && !successOrder) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/products"><Button>Browse Products</Button></Link>
      </div>
    );
  }

  if (successOrder) return <OrderSuccess orderId={successOrder.id} total={successOrder.total} />;

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-xl font-bold mb-3">Login to Checkout</h2>
        <p className="text-gray-500 mb-6">You need to be logged in to place an order.</p>
        <Link href="/login?redirect=/checkout"><Button size="lg">Login / Register</Button></Link>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const { data: order } = await api.post("/orders", data);
      clear();
      setSuccessOrder({ id: order.id, total: order.total_amount });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      addToast(msg || "Order failed. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const total = subtotal();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-5">Delivery Information</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Full Name" {...register("full_name")} error={errors.full_name?.message} />
              <Input label="Phone Number" placeholder="03001234567" {...register("phone")} error={errors.phone?.message} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  {...register("address")}
                  rows={3}
                  placeholder="Street, area, landmark..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
              </div>
              <Input label="City" {...register("city")} error={errors.city?.message} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea {...register("notes")} rows={2} placeholder="Any delivery instructions..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>

              {/* COD notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-amber-800 font-semibold mb-1">💵 Cash on Delivery</div>
                <p className="text-amber-700 text-sm">
                  You will pay <strong>{format(total)}</strong> when your order is delivered.
                  {code !== "PKR" && <span className="ml-1 text-amber-600">(Charged in PKR · {formatPKR(total)})</span>}
                </p>
              </div>

              <Button type="submit" loading={submitting} className="w-full" size="lg">
                Place Order — {format(total)}
              </Button>
            </form>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image src={getImageUrl(product.images[0])} alt={product.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 font-medium line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-400">x{quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 flex-shrink-0">{format(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between"><span>Subtotal</span><span>{format(total)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="text-green-600 font-medium">Free</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t"><span>Total</span><span>{format(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
