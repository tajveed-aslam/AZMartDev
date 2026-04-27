"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductCard } from "@/components/products/ProductCard";
import { PageLoader } from "@/components/ui/Spinner";
import { SORT_OPTIONS } from "@/lib/constants";
import type { ProductFilters } from "@/types";

function ProductCatalog() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 400);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const filters: ProductFilters = {
    page,
    page_size: 12,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(category && { category }),
    sort,
  };

  const { data, isLoading } = useProducts(filters);
  const { data: categories } = useCategories();

  useEffect(() => { setPage(1); }, [debouncedSearch, category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        {category ? (categories?.find((c) => c.slug === category)?.name || "Products") : "All Products"}
      </h1>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategory("")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${!category ? "bg-primary text-white" : "bg-white text-gray-600 border hover:border-primary hover:text-primary"}`}
          >
            All
          </button>
          {(categories || []).map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategory(c.slug === category ? "" : c.slug)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${category === c.slug ? "bg-primary text-white" : "bg-white text-gray-600 border hover:border-primary hover:text-primary"}`}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : data?.items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{data?.total} product{data?.total !== 1 ? "s" : ""} found</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {data?.items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          {/* Pagination */}
          {(data?.pages || 1) > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:border-primary hover:text-primary transition"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-600">Page {page} of {data?.pages}</span>
              <button
                onClick={() => setPage((p) => Math.min(data?.pages || 1, p + 1))}
                disabled={page === data?.pages}
                className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:border-primary hover:text-primary transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProductCatalog />
    </Suspense>
  );
}
