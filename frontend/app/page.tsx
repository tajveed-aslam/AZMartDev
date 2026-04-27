import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Testimonials } from "@/components/home/Testimonials";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-500 mt-1">Browse our curated collection of imported goods</p>
            </div>
          </div>
          <CategoryGrid />
        </section>

        {/* Featured */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-1">Hand-picked bestsellers and top-rated items</p>
            </div>
            <Link href="/products?featured=true" className="text-primary text-sm font-medium hover:underline hidden md:block">
              View All →
            </Link>
          </div>
          <FeaturedProducts />
          <div className="text-center mt-8 md:hidden">
            <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition">
              View All Products
            </Link>
          </div>
        </section>

        {/* Why us */}
        <section className="bg-primary-600 rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Why Shop at A&amp;Z Mart?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🌍", title: "100% Imported", desc: "Authentic goods sourced globally" },
              { icon: "🚚", title: "Fast Delivery", desc: "Delivered to your doorstep" },
              { icon: "💵", title: "Cash on Delivery", desc: "Pay when you receive" },
              { icon: "✅", title: "Quality Assured", desc: "Every item verified before shipping" },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <div className="font-semibold mb-1">{f.title}</div>
                <div className="text-sm text-primary-200">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">What Our Customers Say</h2>
          <Testimonials />
        </section>
      </div>
    </>
  );
}
