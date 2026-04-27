"use client";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { discountPercent, getImageUrl } from "@/lib/formatters";
import { useCurrency } from "@/hooks/useCurrency";
import { StarRating } from "@/components/ui/StarRating";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useUIStore((s) => s.addToast);
  const { format } = useCurrency();
  const discount = product.original_price ? discountPercent(product.price, product.original_price) : 0;
  const image = getImageUrl(product.images[0]);

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-100/60 transition-all duration-300 overflow-hidden border border-gray-100/80 flex flex-col hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="relative aspect-square block overflow-hidden bg-gray-50">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            -{discount}%
          </span>
        )}
        {product.is_featured && discount === 0 && (
          <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            Featured
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold bg-black/60 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
              Out of Stock
            </span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute top-2.5 right-2.5 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-indigo-500 font-semibold mb-1 uppercase tracking-wide">{product.category.name}</p>
        <Link
          href={`/products/${product.id}`}
          className="font-bold text-gray-800 hover:text-indigo-600 line-clamp-2 text-sm mb-2 transition-colors leading-snug"
        >
          {product.name}
        </Link>
        <StarRating rating={product.rating} count={product.review_count} />
        <div className="flex items-baseline gap-2 mt-2 mb-3">
          <span className="font-extrabold text-gray-900 text-base">{format(product.price)}</span>
          {product.original_price && (
            <span className="text-xs text-gray-400 line-through">{format(product.original_price)}</span>
          )}
        </div>
        <button
          disabled={product.stock === 0}
          onClick={() => { addItem(product); addToast(`${product.name} added to cart!`); }}
          className="mt-auto w-full btn-gradient disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 disabled:shadow-none"
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
