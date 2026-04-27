export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const PAGE_SIZE = 12;

export const ORDER_STATUSES = [
  { value: "pending",    label: "Pending",    color: "bg-yellow-100 text-yellow-800" },
  { value: "processing", label: "Processing", color: "bg-blue-100 text-blue-800" },
  { value: "shipped",    label: "Shipped",    color: "bg-purple-100 text-purple-800" },
  { value: "delivered",  label: "Delivered",  color: "bg-green-100 text-green-800" },
  { value: "cancelled",  label: "Cancelled",  color: "bg-red-100 text-red-800" },
];

export const SORT_OPTIONS = [
  { value: "newest",     label: "Newest First" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
];
