"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
            {user.full_name[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user.full_name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <div className="mt-1">
              <Badge className={user.role === "admin" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}>
                {user.role === "admin" ? "Admin" : "Customer"}
              </Badge>
            </div>
          </div>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Full Name</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{user.full_name}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{user.email}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Member Since</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{formatDate(user.created_at)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Account Type</dt>
            <dd className="font-medium text-gray-900 mt-0.5 capitalize">{user.role}</dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/account/orders" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-primary hover:shadow-md transition-all group">
          <div className="text-3xl mb-3">📦</div>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary">My Orders</h3>
          <p className="text-sm text-gray-400 mt-1">Track your orders and history</p>
        </Link>
        {user.role === "admin" && (
          <Link href="/admin" className="bg-primary rounded-2xl p-5 shadow-sm hover:bg-primary-700 transition-all group">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="font-semibold text-white">Admin Panel</h3>
            <p className="text-sm text-primary-200 mt-1">Manage products, orders, categories</p>
          </Link>
        )}
      </div>
    </div>
  );
}
