"use client";
import Link from "next/link";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export function MobileNav() {
  const { mobileNavOpen, closeMobileNav } = useUIStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  if (!mobileNavOpen) return null;

  const handleLogout = () => {
    logout();
    closeMobileNav();
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={closeMobileNav} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col">
        <div className="p-5 border-b flex items-center justify-between">
          <span className="font-bold text-xl text-primary">🛒 A&amp;Z Mart</span>
          <button onClick={closeMobileNav} className="text-gray-500 text-2xl">&times;</button>
        </div>
        <nav className="flex-1 p-5 space-y-1">
          {[
            { href: "/", label: "Home" },
            { href: "/products", label: "All Products" },
          ].map((l) => (
            <Link key={l.href} href={l.href} onClick={closeMobileNav}
              className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary font-medium">
              {l.label}
            </Link>
          ))}
          {user && (
            <>
              <div className="border-t my-3" />
              <Link href="/account" onClick={closeMobileNav} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-50">My Account</Link>
              <Link href="/account/orders" onClick={closeMobileNav} className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-50">My Orders</Link>
              {user.role === "admin" && (
                <Link href="/admin" onClick={closeMobileNav} className="block px-3 py-2 rounded-lg text-primary font-semibold hover:bg-primary-50">Admin Panel</Link>
              )}
            </>
          )}
        </nav>
        <div className="p-5 border-t">
          {user ? (
            <button onClick={handleLogout} className="w-full text-left text-red-600 font-medium px-3 py-2">Logout</button>
          ) : (
            <Link href="/login" onClick={closeMobileNav} className="block text-center bg-primary text-white py-2 rounded-lg font-medium">Login / Register</Link>
          )}
        </div>
      </div>
    </div>
  );
}
