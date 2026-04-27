"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useStoreSettings, useUpdateStoreSettings } from "@/hooks/useStoreSettings";
import { useUIStore } from "@/store/uiStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";

interface FormData {
  store_name: string;
  store_tagline: string;
  store_email: string;
  store_phone: string;
  store_address: string;
  currency: string;
  logo_url: string;
}

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useStoreSettings();
  const updateSettings = useUpdateStoreSettings();
  const addToast = useUIStore((s) => s.addToast);

  const { register, handleSubmit, reset, formState: { isDirty, isSubmitting } } = useForm<FormData>();

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateSettings.mutateAsync(data);
      addToast("Store settings saved!");
    } catch {
      addToast("Failed to save settings", "error");
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Customize your store&apos;s public information</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Store identity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white text-xs">🏪</span>
            Store Identity
          </h2>
          <Input label="Store Name" {...register("store_name")} />
          <Input label="Tagline" {...register("store_tagline")} />
          <Input label="Logo URL (optional)" {...register("logo_url")} placeholder="https://..." />
        </div>

        {/* Contact info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center text-xs">📞</span>
            Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Email" type="email" {...register("store_email")} />
            <Input label="Phone" {...register("store_phone")} />
          </div>
          <Input label="Address" {...register("store_address")} />
        </div>

        {/* Currency */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-xs">💰</span>
            Currency
          </h2>
          <Input label="Currency Code" {...register("currency")} className="max-w-[120px]" />
        </div>

        <div className="flex items-center gap-3 justify-end">
          <Button type="button" variant="ghost" onClick={() => settings && reset(settings)} disabled={!isDirty}>
            Discard
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
