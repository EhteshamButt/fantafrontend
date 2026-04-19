"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";

interface UserItem {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  walletBalance: number;
  level: number;
  dailyLimit: number;
  createdAt: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs} seconds ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

export default function AllUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi
      .getUsers()
      .then((data) => setUsers(data as UserItem[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">All Users</h1>
        <div className="animate-pulse space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with inline search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">All Users</h1>

        <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <input
            type="text"
            placeholder="Email/Username/TRX ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 text-sm text-gray-500 outline-none placeholder:text-gray-400 sm:w-64"
          />
          <button className="flex items-center justify-center bg-indigo-600 px-4 hover:bg-indigo-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-500">No users found</p>
        </div>
      ) : (
        <>
          {/* ── Desktop table (md+) ── */}
          <div className="hidden md:block overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">User</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Email-Phone</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Country</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Joined At</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Balance</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Level</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Daily Limit</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((u) => {
                    const uname = u.name?.toLowerCase().replace(/\s+/g, "") || "unknown";
                    return (
                      <tr key={u.id} className="transition-colors hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-indigo-600">
                          @{uname}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-700">{u.email}</p>
                          <p className="text-xs text-gray-400">{u.phone || "—"}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-700">
                          PK
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <p className="text-sm text-gray-700">
                            {new Date(u.createdAt).toLocaleString("en-PK", {
                              year: "numeric", month: "2-digit", day: "2-digit",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                          <p className="text-xs text-gray-400">{timeAgo(u.createdAt)}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-800">
                          Rs{(u.walletBalance ?? 0).toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-700">
                          {u.level ?? 0}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-700">
                          {u.dailyLimit ?? 0}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => router.push(`/admin/approved-users/${u.id}`)}
                            className="flex items-center gap-1 rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Mobile cards (< md) ── */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((u) => {
              const uname = u.name?.toLowerCase().replace(/\s+/g, "") || "unknown";
              return (
                <div key={u.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                  {[
                    {
                      label: "User",
                      value: <span className="font-medium text-indigo-600">@{uname}</span>,
                    },
                    {
                      label: "Email-Phone",
                      value: (
                        <div className="text-right">
                          <p className="text-gray-700 break-all">{u.email}</p>
                          <p className="text-xs text-gray-400">{u.phone || "—"}</p>
                        </div>
                      ),
                    },
                    { label: "Country", value: <span className="font-semibold text-gray-700">PK</span> },
                    {
                      label: "Joined At",
                      value: (
                        <div className="text-right">
                          <p className="text-gray-700">
                            {new Date(u.createdAt).toLocaleString("en-PK", {
                              year: "numeric", month: "2-digit", day: "2-digit",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                          <p className="text-xs text-gray-400">{timeAgo(u.createdAt)}</p>
                        </div>
                      ),
                    },
                    {
                      label: "Balance",
                      value: (
                        <span className="font-semibold text-gray-800">
                          Rs{(u.walletBalance ?? 0).toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                        </span>
                      ),
                    },
                    { label: "Level", value: <span className="text-gray-700">{u.level ?? 0}</span> },
                    { label: "Daily Limit", value: <span className="text-gray-700">{u.dailyLimit ?? 0}</span> },
                    {
                      label: "Action",
                      value: (
                        <button
                          onClick={() => router.push(`/admin/approved-users/${u.id}`)}
                          className="flex items-center gap-1 rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Details
                        </button>
                      ),
                    },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-0">
                      <span className="text-sm font-bold text-gray-800">{row.label}</span>
                      <div className="text-sm">{row.value}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
