"use client";
import Link from "next/link";
import { useStoreSettings } from "@/hooks/useStoreSettings";

export function Footer() {
  const { data: settings } = useStoreSettings();
  const name    = settings?.store_name    ?? "A&Z Mart";
  const tagline = settings?.store_tagline ?? "Your one-stop shop for premium imported goods.";
  const email   = settings?.store_email   ?? "info@azmart.pk";
  const phone   = settings?.store_phone   ?? "0300-1234567";
  const address = settings?.store_address ?? "Local Area, Your City";

  return (
    <footer className="relative mt-16 overflow-hidden" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)" }}>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-extrabold text-lg">
                {name[0]}
              </div>
              <span className="font-extrabold text-xl text-white">{name}</span>
            </div>
            <p className="text-sm text-indigo-200 leading-relaxed max-w-xs">{tagline} Cash on delivery. All authentic imports.</p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/products", label: "All Products" },
                { href: "/products?category=perfumes", label: "Perfumes" },
                { href: "/products?category=shoes", label: "Shoes" },
                { href: "/products?category=electronics", label: "Electronics" },
                { href: "/products?category=jewellery", label: "Jewellery" },
                { href: "/products?category=toys", label: "Toys" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-indigo-300 hover:text-amber-400 transition-colors duration-200">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              {[
                { icon: "📍", text: address },
                { icon: "📞", text: phone },
                { icon: "📧", text: email },
                { icon: "🕐", text: "Mon–Sat: 9am – 9pm" },
              ].map((c) => (
                <li key={c.icon} className="flex items-start gap-2 text-indigo-200">
                  <span className="mt-0.5">{c.icon}</span>
                  <span>{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-indigo-400">© {new Date().getFullYear()} {name}. All rights reserved.</p>
          <p className="text-xs text-indigo-500">Made with ❤️ for portfolio demo</p>
        </div>
      </div>
    </footer>
  );
}
