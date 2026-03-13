"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";

interface UserItem {
  _id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

const roleBadge: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  user: "bg-green-100 text-green-700",
  client: "bg-purple-100 text-purple-700",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    adminApi
      .getUsers()
      .then((data) => setUsers(data as UserItem[]))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdating(userId);
    setError("");
    setSuccess("");
    try {
      const updated = (await adminApi.updateUserRole(userId, newRole)) as UserItem;
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: updated.role } : u))
      );
      const userName = users.find((u) => u._id === userId)?.name || "User";
      setSuccess(`${userName} role updated to ${newRole}`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-8 w-48 rounded bg-gray-200" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
          {users.length} users
        </span>
      </div>

      {success && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
          {success}
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Current Role</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Change Role</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className="transition-colors hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-800">
                      {u.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {u.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${roleBadge[u.role] || roleBadge.user}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={updating === u._id}
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
                      >
                        <option value="user">User</option>
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                      </select>
                      {updating === u._id && (
                        <span className="ml-2 text-xs text-gray-400">Saving...</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString("en-PK", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
