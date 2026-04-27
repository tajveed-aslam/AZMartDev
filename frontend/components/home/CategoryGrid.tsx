"use client";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";

const CATEGORY_GRADIENTS: Record<string, string> = {
  perfumes:    "from-pink-500 to-rose-500",
  shoes:       "from-indigo-500 to-blue-500",
  electronics: "from-violet-500 to-purple-500",
  jewellery:   "from-amber-500 to-yellow-400",
  toys:        "from-green-500 to-emerald-400",
};

const CATEGORY_BG: Record<string, string> = {
  perfumes:    "bg-pink-50 hover:bg-pink-100 border-pink-100",
  shoes:       "bg-indigo-50 hover:bg-indigo-100 border-indigo-100",
  electronics: "bg-violet-50 hover:bg-violet-100 border-violet-100",
  jewellery:   "bg-amber-50 hover:bg-amber-100 border-amber-100",
  toys:        "bg-green-50 hover:bg-green-100 border-green-100",
};

const CATEGORY_TEXT: Record<string, string> = {
  perfumes:    "text-pink-700",
  shoes:       "text-indigo-700",
  electronics: "text-violet-700",
  jewellery:   "text-amber-700",
  toys:        "text-green-700",
};

export function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {(categories || []).map((cat) => {
        const gradClass = CATEGORY_GRADIENTS[cat.slug] || "from-gray-400 to-gray-500";
        const bgClass = CATEGORY_BG[cat.slug] || "bg-gray-50 hover:bg-gray-100 border-gray-100";
        const txtClass = CATEGORY_TEXT[cat.slug] || "text-gray-700";

        return (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`group rounded-2xl p-5 text-center border card-hover ${bgClass} flex flex-col items-center`}
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradClass} flex items-center justify-center text-3xl mb-3 shadow-md group-hover:scale-110 transition-transform duration-200`}>
              {cat.icon}
            </div>
            <div className={`font-bold text-sm ${txtClass}`}>{cat.name}</div>
            <div className="text-xs text-gray-400 mt-1">{cat.product_count} items</div>
          </Link>
        );
      })}
    </div>
  );
}
