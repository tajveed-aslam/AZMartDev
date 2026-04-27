"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1600&h=700&fit=crop&auto=format",
    tag: "🌸 New Arrivals",
    heading: "Premium Imported Fragrances",
    sub: "Authentic perfumes from UAE, Europe & beyond",
    offer: "Up to 17% Off",
    offerColor: "bg-pink-500",
    cta: "Shop Perfumes",
    href: "/products?category=perfumes",
    overlayFrom: "#1a0a1a",
    overlayVia: "#4a1942",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&h=700&fit=crop&auto=format",
    tag: "👟 Brand Originals",
    heading: "Nike, Adidas & More",
    sub: "Genuine imported sneakers — direct from the source",
    offer: "From PKR 11,200",
    offerColor: "bg-indigo-500",
    cta: "Browse Shoes",
    href: "/products?category=shoes",
    overlayFrom: "#0a0a2e",
    overlayVia: "#1a1a5e",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1600&h=700&fit=crop&auto=format",
    tag: "🔌 Tech Accessories",
    heading: "Latest Electronics & Gadgets",
    sub: "Earbuds, speakers, chargers & hubs — all imported",
    offer: "From PKR 2,200",
    offerColor: "bg-violet-500",
    cta: "Explore Electronics",
    href: "/products?category=electronics",
    overlayFrom: "#100a2e",
    overlayVia: "#2e1a5e",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&h=700&fit=crop&auto=format",
    tag: "💍 New Collection",
    heading: "Jewellery for Every Occasion",
    sub: "Necklaces, earrings, bracelets & rings — imported & gorgeous",
    offer: "From PKR 720",
    offerColor: "bg-amber-500",
    cta: "View Jewellery",
    href: "/products?category=jewellery",
    overlayFrom: "#1a1000",
    overlayVia: "#3a2800",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=700&fit=crop&auto=format",
    tag: "🧸 Kids Corner",
    heading: "Toys That Spark Imagination",
    sub: "LEGO, RC cars, kinetic sand & more — all genuine imports",
    offer: "From PKR 1,800",
    offerColor: "bg-emerald-500",
    cta: "Shop Toys",
    href: "/products?category=toys",
    overlayFrom: "#001a0a",
    overlayVia: "#003a1a",
  },
];

const STATS = [
  { value: "25+",  label: "Products" },
  { value: "5",    label: "Categories" },
  { value: "500+", label: "Happy Customers" },
  { value: "COD",  label: "Cash on Delivery" },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const [fading,  setFading]  = useState(false);

  const goTo = useCallback((idx: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 300);
  }, []);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  const slide = SLIDES[current];

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* === Image layer === */}
      <div className={`relative h-[480px] md:h-[580px] w-full transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}>
        <Image
          key={slide.id}
          src={slide.image}
          alt={slide.heading}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(105deg, ${slide.overlayFrom}f0 0%, ${slide.overlayVia}cc 45%, transparent 100%)`,
          }}
        />
        {/* Right-side fade for readability on wide screens */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
        {/* Bottom fade into page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-100 to-transparent" />
      </div>

      {/* === Text content (overlaid on image) === */}
      <div className={`absolute inset-0 flex items-center transition-all duration-300 ${fading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            {/* Category tag */}
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm text-white/90 mb-5 backdrop-blur-sm">
              {slide.tag}
            </div>

            {/* Offer badge */}
            <div className={`inline-flex ml-2 items-center ${slide.offerColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg mb-5`}>
              🔥 {slide.offer}
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 tracking-tight drop-shadow-lg">
              {slide.heading}
            </h1>

            <p className="text-base md:text-lg text-white/80 mb-8 leading-relaxed">
              {slide.sub}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={slide.href}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold px-7 py-3.5 rounded-2xl transition-all duration-200 shadow-xl shadow-amber-500/40 hover:scale-105"
              >
                {slide.cta}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-2xl transition-all duration-200 backdrop-blur-sm hover:scale-105"
              >
                All Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* === Prev / Next arrows === */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* === Dot navigation === */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-8 h-2.5 bg-amber-400 shadow-lg shadow-amber-500/50"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* === Slide counter === */}
      <div className="absolute top-5 right-16 text-white/60 text-xs font-medium tabular-nums z-10 hidden sm:block">
        {current + 1} / {SLIDES.length}
      </div>

      {/* === Stats bar === */}
      <div className="relative bg-gradient-to-r from-indigo-950 to-violet-950 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl md:text-2xl font-extrabold text-amber-400">{s.value}</div>
                <div className="text-xs text-indigo-300 font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
