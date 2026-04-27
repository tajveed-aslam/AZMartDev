"use client";
import { useState, useRef, useEffect } from "react";
import { CURRENCIES } from "@/lib/currencies";
import { useCurrencyStore } from "@/store/currencyStore";
import { getCurrency } from "@/lib/currencies";

export function TopBar() {
  const code = useCurrencyStore((s) => s.code);
  const setCode = useCurrencyStore((s) => s.setCode);
  const current = getCurrency(code);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = CURRENCIES.filter(
    (c) =>
      search === "" ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  const select = (c: typeof CURRENCIES[0]) => {
    setCode(c.code);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="bg-gray-950 border-b border-white/5 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
        {/* Left: promo message */}
        <p className="text-gray-400 hidden sm:block truncate">
          <span className="text-amber-400 font-semibold">🚚 Free Cash on Delivery</span>
          {" "}— All orders across Pakistan
        </p>
        <p className="text-gray-400 sm:hidden text-xs">Free COD — Pakistan wide</p>

        {/* Right: currency selector */}
        <div ref={ref} className="relative flex-shrink-0">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors px-2.5 py-1 rounded-lg hover:bg-white/5"
          >
            <span className="text-sm leading-none">{current.flag}</span>
            <span className="font-semibold text-white">{current.code}</span>
            <span className="text-gray-500">{current.symbol}</span>
            <svg
              className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-2xl shadow-2xl shadow-gray-900/30 border border-gray-100 z-50 overflow-hidden animate-scale-in">
              {/* Header */}
              <div className="px-4 pt-3 pb-2 border-b border-gray-50">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Currency</p>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search currency..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50"
                  />
                </div>
              </div>

              {/* Currency list */}
              <div className="overflow-y-auto max-h-64 py-1">
                {filtered.length === 0 ? (
                  <p className="text-center text-xs text-gray-400 py-4">No currencies found</p>
                ) : (
                  filtered.map((c) => {
                    const isActive = c.code === code;
                    return (
                      <button
                        key={c.code}
                        onClick={() => select(c)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span className="text-base w-6 text-center">{c.flag}</span>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-sm">{c.code}</span>
                          <span className="text-xs text-gray-400 ml-2 truncate">{c.name}</span>
                        </div>
                        <span className={`text-xs font-mono ${isActive ? "text-indigo-500" : "text-gray-400"}`}>
                          {c.symbol}
                        </span>
                        {isActive && (
                          <svg className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer note */}
              <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/50">
                <p className="text-xs text-gray-400">
                  ⚠️ Rates are approximate. Orders are placed in PKR.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
