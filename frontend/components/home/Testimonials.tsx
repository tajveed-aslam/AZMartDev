const TESTIMONIALS = [
  { name: "Ahmed K.", city: "Karachi", text: "Amazing quality! The imported perfumes are exactly as described. Fast delivery and cash on delivery makes it so convenient.", rating: 5 },
  { name: "Sara M.", city: "Lahore",   text: "Ordered Nike shoes and they're 100% original. A&Z Mart is my go-to store for imported items now.", rating: 5 },
  { name: "Bilal R.", city: "Islamabad", text: "Great selection of electronics accessories. The USB-C hub works perfectly. Will definitely order again!", rating: 4 },
];

export function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {TESTIMONIALS.map((t, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex gap-1 mb-3">
            {[...Array(t.rating)].map((_, j) => (
              <svg key={j} className="w-4 h-4 text-accent fill-accent" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-600 text-sm mb-4 italic">&ldquo;{t.text}&rdquo;</p>
          <div className="font-semibold text-gray-800">{t.name}</div>
          <div className="text-xs text-gray-400">{t.city}</div>
        </div>
      ))}
    </div>
  );
}
