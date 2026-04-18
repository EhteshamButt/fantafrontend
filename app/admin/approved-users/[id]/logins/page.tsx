"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";

interface LoginRecord {
  id: string;
  ip: string;
  browser: string;
  os: string;
  location: string | null;
  createdAt: string;
  user?: { name: string };
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

export default function UserLoginsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [logins, setLogins] = useState<LoginRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    Promise.all([
      adminApi.getLoginHistory(id),
      adminApi.getUserDetail(id),
    ])
      .then(([history, detail]) => {
        setLogins(history);
        setUsername(detail.user.referralCode || detail.user.name.toLowerCase().replace(/\s+/g, ""));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const filtered = logins.filter((l) => {
    const q = search.toLowerCase();
    return !q || l.ip?.toLowerCase().includes(q) || l.browser?.toLowerCase().includes(q) || l.os?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">User Login History</h1>
        </div>
        <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <input
            type="text"
            placeholder={username || "Search..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 px-4 py-2.5 text-sm text-gray-500 outline-none placeholder:text-gray-400"
          />
          <button className="flex items-center justify-center bg-indigo-600 px-4 hover:bg-indigo-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-gray-200" />)}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">User</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Login at</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">IP</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Location</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Browser | OS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-400">No login records found</td>
                  </tr>
                ) : (
                  filtered.map((l) => (
                    <tr key={l.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-medium text-indigo-600">@{username}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <p className="text-sm text-gray-700">
                          {new Date(l.createdAt).toLocaleString("en-PK", {
                            year: "numeric", month: "2-digit", day: "2-digit",
                            hour: "2-digit", minute: "2-digit", hour12: true,
                          })}
                        </p>
                        <p className="text-xs text-gray-400">{timeAgo(l.createdAt)}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="font-medium text-blue-600">{l.ip || "—"}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{l.location || "—"}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                        {l.browser && l.os ? `${l.browser} | ${l.os}` : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
