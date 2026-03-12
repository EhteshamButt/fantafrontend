"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .profile()
      .then((data) => setUser(data as User))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const roleBadgeColor: Record<string, string> = {
    admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    client: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    user: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Logout
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Name</p>
              <p className="text-lg font-medium text-zinc-900 dark:text-white">
                {user.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Email</p>
              <p className="text-lg font-medium text-zinc-900 dark:text-white">
                {user.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Role</p>
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${roleBadgeColor[user.role] || roleBadgeColor.user}`}
              >
                {user.role}
              </span>
            </div>
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Member since
              </p>
              <p className="text-zinc-900 dark:text-white">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
