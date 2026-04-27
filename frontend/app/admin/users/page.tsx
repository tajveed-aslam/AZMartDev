"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["admin-users"],
    queryFn: () => api.get("/admin/users").then((r) => r.data),
  });

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users ({users?.length || 0})</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-5 py-3">User</th>
              <th className="text-left px-5 py-3">Email</th>
              <th className="text-left px-5 py-3">Role</th>
              <th className="text-left px-5 py-3">Joined</th>
              <th className="text-left px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(users || []).map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      {user.full_name[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800">{user.full_name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-600">{user.email}</td>
                <td className="px-5 py-3">
                  <Badge className={user.role === "admin" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-gray-400">{formatDate(user.created_at)}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
