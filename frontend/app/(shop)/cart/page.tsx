"use client";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { getImageUrl } from "@/lib/formatters";
import { useCurrency } from "@/hooks/useCurrency";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal } = useCartStore();
  const { format } = useCurrency();

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some imported goodies to get started!</p>
        <Link href="/products">
          <Button size="lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const total = subtotal();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart ({items.length} item{items.length !== 1 ? "s" : ""})</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4">
              <Link href={`/products/${product.id}`} className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <Image src={getImageUrl(product.images[0])} alt={product.name} fill className="object-cover" sizes="80px" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${product.id}`} className="font-semibold text-gray-800 hover:text-primary text-sm line-clamp-2">{product.name}</Link>
                <p className="text-xs text-gray-400 mt-0.5">{product.category.name}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border rounded-lg overflow-hidden text-sm">
                    <button onClick={() => updateQty(product.id, quantity - 1)} className="px-2.5 py-1 text-gray-600 hover:bg-gray-50">−</button>
                    <span className="px-3 py-1 font-medium">{quantity}</span>
                    <button onClick={() => updateQty(product.id, quantity + 1)} className="px-2.5 py-1 text-gray-600 hover:bg-gray-50">+</button>
                  </div>
                  <span className="font-bold text-gray-900">{format(product.price * quantity)}</span>
                </div>
              </div>
              <button onClick={() => removeItem(product.id)} className="text-gray-300 hover:text-red-400 transition flex-shrink-0 self-start">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-5">Order Summary</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between"><span>Subtotal</span><span>{format(total)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="text-green-600 font-medium">Free</span></div>
              <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span><span>{format(total)}</span>
              </div>
            </div>
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 mb-5">
              💵 Cash on Delivery — pay when received
            </div>
            <Link href="/checkout">
              <Button className="w-full" size="lg">Proceed to Checkout →</Button>
            </Link>
            <Link href="/products" className="block text-center text-sm text-gray-500 hover:text-primary mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
