export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  is_active: boolean;
  product_count: number;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  rating: number;
  review_count: number;
  images: string[];
  is_featured: boolean;
  is_active: boolean;
  category_id: number;
  category: Category;
  created_at: string;
}

export interface ProductListOut {
  items: Product[];
  total: number;
  page: number;
  pages: number;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "customer";
  is_active: boolean;
  created_at: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
  item_count: number;
}

export interface OrderItem {
  id: number;
  product_id: number | null;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  notes: string | null;
  created_at: string;
  items: OrderItem[];
}

export interface AdminOrder extends Order {
  user_id: number | null;
  user_email: string | null;
  user_name: string | null;
}

export interface LocalCartItem {
  product: Product;
  quantity: number;
}

export interface StoreSettings {
  id: number;
  store_name: string;
  store_tagline: string;
  store_email: string;
  store_phone: string;
  store_address: string;
  currency: string;
  logo_url: string;
}

export interface ProductFilters {
  page?: number;
  page_size?: number;
  category?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort?: string;
  featured?: boolean;
}
