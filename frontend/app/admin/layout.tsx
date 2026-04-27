"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { PageLoader } from "@/components/ui/Spinner";

const NAV = [
  { href: "/admin",            icon: "📊", label: "Dashboard" },
  { href: "/admin/products",   icon: "📦", label: "Products" },
  { href: "/admin/categories", icon: "🏷️", label: "Categories" },
  { href: "/admin/orders",     icon: "🛍️", label: "Orders" },
  { href: "/admin/users",      icon: "👥", label: "Users" },
  { href: "/admin/settings",   icon: "⚙️", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    if (!initialized) return; // still waiting for fetchMe to settle
    if (!user) router.push("/login?redirect=/admin");
    else if (user.role !== "admin") router.push("/");
  }, [user, initialized, router]);

  // Show loader until we know who the user is
  if (!initialized || !user || user.role !== "admin") return <PageLoader />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col min-h-screen flex-shrink-0 hidden md:flex">
        <div className="p-5 border-b border-gray-700">
          <Link href="/" className="font-bold text-lg">🛒 A&amp;Z Mart</Link>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${active ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-700">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition">
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Mobile top nav */}
        <div className="md:hidden bg-gray-900 text-white p-4 flex gap-3 overflow-x-auto">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white whitespace-nowrap">
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
