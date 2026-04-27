"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { PageLoader } from "@/components/ui/Spinner";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    if (!initialized) return;
    if (!user) router.push("/login?redirect=/account");
  }, [user, initialized, router]);

  if (!initialized || !user) return <PageLoader />;
  return <>{children}</>;
}
