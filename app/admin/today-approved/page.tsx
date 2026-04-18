"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";

interface TodayApproved {
  id: string;
  user?: { id: string; name: string; email: string };
  packageName: string;
  amount: number;
  updatedAt: string;
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

export default function TodayApprovedPage() {
  const [data, setData] = useState<TodayApproved[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    adminApi
      .getTodayApprovedUsers()
      .then((res) => setData(res as TodayApproved[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      item.user?.name.toLowerCase().includes(q) ||
      item.user?.email.toLowerCase().includes(q);
    const itemDate = new Date(item.updatedAt);
    const matchesStart = !startDate || itemDate >= new Date(startDate);
    const matchesEnd = !endDate || itemDate <= new Date(endDate + "T23:59:59");
    return matchesSearch && matchesStart && matchesEnd;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Today Approved Users</h1>
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Today Approved Users</h1>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          {filtered.length} today
        </span>
      </div>

      {/* Search */}
      <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-5 py-3 text-sm text-gray-500 outline-none placeholder:text-gray-400"
        />
        <button className="flex items-center justify-center bg-indigo-600 px-5 hover:bg-indigo-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </button>
      </div>

      {/* Date Range */}
      <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-1 items-center gap-2 px-5 py-3">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-sm text-gray-500 outline-none" />
          <span className="text-gray-400">–</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-sm text-gray-500 outline-none" />
        </div>
        <button className="flex items-center justify-center bg-indigo-600 px-5 hover:bg-indigo-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-3 text-sm font-medium text-gray-500">No approvals today</p>
        </div>
      ) : (
        <>
          {/* ── Desktop table (md+) ── */}
          <div className="hidden md:block overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">#</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">User Name</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Email</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Package</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Amount</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Approved At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item, index) => (
                    <tr key={item.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-400">{index + 1}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-indigo-600">
                        {item.user?.name || "Unknown"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{item.user?.email || ""}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{item.packageName}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-800">
                        Rs {item.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <p className="text-sm text-gray-700">
                          {new Date(item.updatedAt).toLocaleString("en-PK", {
                            year: "numeric", month: "2-digit", day: "2-digit",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                        <p className="text-xs text-gray-400">{timeAgo(item.updatedAt)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Mobile cards (< md) ── */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((item, index) => (
              <div key={item.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                {[
                  {
                    label: "#",
                    value: <span className="text-xs text-gray-400">{index + 1}</span>,
                  },
                  {
                    label: "User Name",
                    value: <span className="font-medium text-indigo-600">{item.user?.name || "Unknown"}</span>,
                  },
                  {
                    label: "Email",
                    value: <span className="text-gray-500 break-all">{item.user?.email || ""}</span>,
                  },
                  {
                    label: "Package",
                    value: <span className="text-gray-700">{item.packageName}</span>,
                  },
                  {
                    label: "Amount",
                    value: (
                      <span className="font-semibold text-gray-800">
                        Rs {item.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                      </span>
                    ),
                  },
                  {
                    label: "Approved At",
                    value: (
                      <div className="text-right">
                        <p className="text-xs text-gray-700">
                          {new Date(item.updatedAt).toLocaleString("en-PK", {
                            year: "numeric", month: "2-digit", day: "2-digit",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                        <p className="text-xs text-gray-400">{timeAgo(item.updatedAt)}</p>
                      </div>
                    ),
                  },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-0">
                    <span className="text-sm font-bold text-gray-800">{row.label}</span>
                    <div className="text-sm">{row.value}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
