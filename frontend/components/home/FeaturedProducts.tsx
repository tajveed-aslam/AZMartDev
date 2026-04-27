"use client";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { discountPercent, getImageUrl } from "@/lib/formatters";
import { useCurrency } from "@/hooks/useCurrency";
import { StarRating } from "@/components/ui/StarRating";
import { PageLoader } from "@/components/ui/Spinner";
import type { Product } from "@/types";

function FeaturedCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useUIStore((s) => s.addToast);
  const { format } = useCurrency();
  const discount = product.original_price ? discountPercent(product.price, product.original_price) : 0;
  const image = getImageUrl(product.images[0]);

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-100/60 transition-all duration-300 overflow-hidden border border-gray-100/80 flex flex-col hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="relative aspect-square block overflow-hidden bg-gray-50">
        <Image src={image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            -{discount}%
          </span>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-indigo-500 font-semibold mb-1 uppercase tracking-wide">{product.category.name}</p>
        <Link href={`/products/${product.id}`} className="font-bold text-gray-800 hover:text-indigo-600 line-clamp-2 text-sm mb-2 transition-colors leading-snug">
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
          onClick={() => { addItem(product, 1); addToast(`${product.name} added to cart`); }}
          className="mt-auto w-full btn-gradient text-sm font-semibold py-2.5 rounded-xl transition-all duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  const { data, isLoading } = useProducts({ featured: true, page_size: 8 });

  if (isLoading) return <PageLoader />;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {(data?.items || []).map((p) => <FeaturedCard key={p.id} product={p} />)}
    </div>
  );
}
