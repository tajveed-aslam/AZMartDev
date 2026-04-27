"use client";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium min-w-[260px] animate-slide-up",
            t.type === "success" && "bg-green-600",
            t.type === "error"   && "bg-red-600",
            t.type === "info"    && "bg-primary"
          )}
        >
          <span className="flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="text-white/70 hover:text-white">✕</button>
        </div>
      ))}
    </div>
  );
}
