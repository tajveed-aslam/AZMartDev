"use client";
import { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useForm } from "react-hook-form";
import { formatPKR, getImageUrl } from "@/lib/formatters";
import { useCategories } from "@/hooks/useCategories";
import { useUIStore } from "@/store/uiStore";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { PageLoader } from "@/components/ui/Spinner";
import type { Product } from "@/types";

interface FormData {
  name: string;
  description: string;
  price: string;
  original_price: string;
  stock: string;
  category_id: string;
  is_featured: boolean;
}

function ProductForm({ product, onClose }: { product?: Product; onClose: () => void }) {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const { data: categories } = useCategories();
  const [images, setImages] = useState<string[]>(product?.images || []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: product ? {
      name: product.name, description: product.description || "",
      price: String(product.price), original_price: String(product.original_price || ""),
      stock: String(product.stock), category_id: String(product.category_id), is_featured: product.is_featured,
    } : { is_featured: false, stock: "0", price: "", original_price: "", category_id: "", name: "", description: "" },
  });

  const onSubmit = async (data: FormData) => {
    if (!data.name || !data.price || !data.category_id) {
      addToast("Please fill in all required fields", "error");
      return;
    }
    const payload = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      original_price: data.original_price ? parseFloat(data.original_price) : null,
      stock: parseInt(data.stock) || 0,
      category_id: parseInt(data.category_id),
      is_featured: data.is_featured,
      images,
    };
    try {
      if (product) {
        await api.put(`/products/${product.id}`, payload);
        addToast("Product updated!");
      } else {
        await api.post("/products", payload);
        addToast("Product created!");
      }
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      addToast(msg || "Failed", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Product Name" {...register("name")} error={errors.name?.message} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea {...register("description")} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Price (PKR)" type="number" {...register("price")} error={errors.price?.message} />
        <Input label="Original Price (PKR)" type="number" {...register("original_price")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Stock" type="number" {...register("stock")} error={errors.stock?.message} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select {...register("category_id")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select category</option>
            {(categories || []).map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id.message}</p>}
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" {...register("is_featured")} className="w-4 h-4 text-primary rounded" />
        <span className="text-sm font-medium text-gray-700">Featured Product</span>
      </label>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
        <ImageUpload value={images} onChange={setImages} maxImages={5} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isSubmitting} className="flex-1">
          {product ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const [modalProduct, setModalProduct] = useState<Product | null | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["products", { page, page_size: 10 }],
    queryFn: () => api.get("/products", { params: { page, page_size: 10 } }).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      addToast("Product deactivated");
    },
  });

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button onClick={() => setModalProduct(null)}>+ Add Product</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Price</th>
                <th className="text-left px-5 py-3">Stock</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(data?.items || []).map((p: Product) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.images[0] && <Image src={getImageUrl(p.images[0])} alt={p.name} fill className="object-cover" sizes="40px" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{p.name}</div>
                        {p.is_featured && <span className="text-xs text-accent font-medium">⭐ Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{p.category?.name}</td>
                  <td className="px-5 py-3 font-medium">{formatPKR(p.price)}</td>
                  <td className="px-5 py-3">
                    <span className={p.stock > 0 ? "text-green-600" : "text-red-500"}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setModalProduct(p)} className="text-xs text-primary hover:underline font-medium">Edit</button>
                      <button onClick={() => { if (confirm("Deactivate this product?")) deleteMutation.mutate(p.id); }} className="text-xs text-red-500 hover:underline font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(data?.pages || 1) > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:border-primary">← Prev</button>
            <span className="text-sm text-gray-600">Page {page} of {data?.pages}</span>
            <button onClick={() => setPage((p) => Math.min(data?.pages, p + 1))} disabled={page === data?.pages} className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:border-primary">Next →</button>
          </div>
        )}
      </div>

      <Modal
        open={modalProduct !== undefined}
        onClose={() => setModalProduct(undefined)}
        title={modalProduct ? "Edit Product" : "Add Product"}
        className="max-w-2xl"
      >
        {modalProduct !== undefined && (
          <ProductForm product={modalProduct || undefined} onClose={() => setModalProduct(undefined)} />
        )}
      </Modal>
    </div>
  );
}
