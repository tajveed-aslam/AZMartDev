"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { useUIStore } from "@/store/uiStore";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";
import type { Category } from "@/types";

const EMOJI_OPTIONS = ["🌸", "👟", "🔌", "💍", "🧸", "👗", "💄", "🎮", "📱", "⌚", "👜", "🕶️", "🍫", "🧴", "🎨", "🏋️", "🎵", "📚", "🏠", "🚗"];

const schema = z.object({
  name: z.string().min(2, "Name required"),
  slug: z.string().min(2, "Slug required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  icon: z.string().min(1, "Select an icon"),
});
type FormData = z.infer<typeof schema>;

function CategoryForm({ category, onClose }: { category?: Category; onClose: () => void }) {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const [selectedIcon, setSelectedIcon] = useState(category?.icon || "📦");

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: category
      ? { name: category.name, slug: category.slug, icon: category.icon }
      : { icon: "📦" },
  });

  const autoSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const onSubmit = async (data: FormData) => {
    try {
      if (category) {
        await api.put(`/categories/${category.id}`, data);
        addToast("Category updated!");
      } else {
        await api.post("/categories", data);
        addToast("Category created!");
      }
      qc.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      addToast(msg || "Failed", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          label="Category Name"
          {...register("name")}
          error={errors.name?.message}
          onChange={(e) => {
            register("name").onChange(e);
            if (!category) setValue("slug", autoSlug(e.target.value));
          }}
        />
      </div>
      <Input
        label="Slug (URL-friendly)"
        {...register("slug")}
        error={errors.slug?.message}
        placeholder="e.g. imported-shoes"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
        <div className="grid grid-cols-10 gap-2">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => { setSelectedIcon(emoji); setValue("icon", emoji); }}
              className={`w-9 h-9 text-xl rounded-lg flex items-center justify-center border-2 transition ${selectedIcon === emoji ? "border-primary bg-primary-50" : "border-gray-200 hover:border-gray-400"}`}
            >
              {emoji}
            </button>
          ))}
        </div>
        {errors.icon && <p className="mt-1 text-xs text-red-500">{errors.icon.message}</p>}
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isSubmitting} className="flex-1">
          {category ? "Update Category" : "Create Category"}
        </Button>
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const [modalCat, setModalCat] = useState<Category | null | undefined>(undefined);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      addToast("Category deleted");
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      addToast(msg || "Cannot delete", "error");
    },
  });

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Button onClick={() => setModalCat(null)}>+ Add Category</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-5 py-3">Icon</th>
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Slug</th>
              <th className="text-left px-5 py-3">Products</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(categories || []).map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-2xl">{cat.icon}</td>
                <td className="px-5 py-3 font-medium text-gray-800">{cat.name}</td>
                <td className="px-5 py-3 text-gray-400 font-mono text-xs">{cat.slug}</td>
                <td className="px-5 py-3 text-gray-600">{cat.product_count}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cat.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {cat.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => setModalCat(cat)} className="text-xs text-primary hover:underline font-medium">Edit</button>
                    <button
                      onClick={() => {
                        if (cat.product_count > 0) {
                          addToast(`Cannot delete: ${cat.product_count} product(s) in this category`, "error");
                          return;
                        }
                        if (confirm("Delete this category?")) deleteMutation.mutate(cat.id);
                      }}
                      className="text-xs text-red-500 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalCat !== undefined}
        onClose={() => setModalCat(undefined)}
        title={modalCat ? "Edit Category" : "Add Category"}
      >
        {modalCat !== undefined && (
          <CategoryForm category={modalCat || undefined} onClose={() => setModalCat(undefined)} />
        )}
      </Modal>
    </div>
  );
}
