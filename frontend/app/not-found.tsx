import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-7xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">404</h1>
        <p className="text-gray-500 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
