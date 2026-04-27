export function formatPKR(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "…" : str;
}

export function getImageUrl(url: string): string {
  if (!url) return "https://picsum.photos/seed/default/600/600";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${url}`;
}

export function discountPercent(price: number, original: number): number {
  return Math.round(((original - price) / original) * 100);
}
