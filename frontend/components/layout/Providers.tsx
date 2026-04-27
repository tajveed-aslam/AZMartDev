"use client";
import { useEffect, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { useCartStore } from "@/store/cartStore";
import { ToastContainer } from "@/components/ui/Toast";

// Stable client — created once, never recreated on re-renders
function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: 1 } } });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  const fetchMe = useAuthStore((s) => s.fetchMe);

  // Kick off auth hydration on mount — no render-blocking
  useEffect(() => {
    fetchMe();
    useCurrencyStore.persist.rehydrate();
    useCartStore.persist.rehydrate();
  }, [fetchMe]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer />
    </QueryClientProvider>
  );
}
