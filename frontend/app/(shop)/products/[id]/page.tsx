"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useProduct } from "@/hooks/useProducts";
import { useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { discountPercent, getImageUrl } from "@/lib/formatters";
import { useCurrency } from "@/hooks/useCurrency";
import { StarRating } from "@/components/ui/StarRating";
import { ProductCard } from "@/components/products/ProductCard";
import { PageLoader } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(Number(id));
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useUIStore((s) => s.addToast);
  const { format } = useCurrency();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const { data: related } = useProducts({
    category: product?.category?.slug,
    page_size: 4,
  });

  if (isLoading) return <PageLoader />;
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found</div>;

  const discount = product.original_price ? discountPercent(product.price, product.original_price) : 0;
  const images = product.images.length > 0 ? product.images : ["https://picsum.photos/seed/default/600/600"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex gap-2">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border">
            <Image
              src={getImageUrl(images[activeImg])}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-accent text-white text-sm font-bold px-3 py-1 rounded-full">
                -{discount}% OFF
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${activeImg === i ? "border-primary" : "border-gray-200"}`}
                >
                  <Image src={getImageUrl(img)} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <p className="text-primary font-medium text-sm mb-2">{product.category.name}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
          <StarRating rating={product.rating} count={product.review_count} />

          <div className="flex items-center gap-3 mt-4 mb-6">
            <span className="text-3xl font-bold text-gray-900">{format(product.price)}</span>
            {product.original_price && (
              <span className="text-lg text-gray-400 line-through">{format(product.original_price)}</span>
            )}
            {discount > 0 && (
              <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-0.5 rounded-full">
                Save {format(product.original_price! - product.price)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Stock */}
          <div className={`text-sm font-medium mb-6 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : "✗ Out of Stock"}
          </div>

          {/* Qty + Add to cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-xl overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 text-gray-600 hover:bg-gray-100 text-lg">−</button>
                <span className="px-4 py-2 font-medium min-w-[2.5rem] text-center">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="px-4 py-2 text-gray-600 hover:bg-gray-100 text-lg">+</button>
              </div>
              <Button
                className="flex-1"
                size="lg"
                onClick={() => { addItem(product, qty); addToast(`${product.name} added to cart!`); }}
              >
                🛒 Add to Cart
              </Button>
            </div>
          )}

          {/* COD notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            💵 <strong>Cash on Delivery</strong> — Pay when your order arrives. No upfront payment needed.
          </div>
        </div>
      </div>

      {/* Related products */}
      {related && related.items.filter((p) => p.id !== product.id).length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {related.items.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
