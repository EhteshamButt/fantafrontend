"use client";

import { useEffect, useState } from "react";
import { adminApi, WithdrawalRecord } from "@/lib/api";

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

function formatMethod(m: string) {
  return m === "easypaisa" ? "Easypaisa" : m === "jazzcash" ? "Jazzcash" : m;
}

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function TodayWithdrawalPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = () => {
    setLoading(true);
    setError(null);
    adminApi
      .getTodayApprovedWithdrawals()
      .then((data) => {
        // Extra client-side guard: only approved + today
        const filtered = data.filter(
          (w) => w.status === "approved" && isToday(w.createdAt)
        );
        setWithdrawals(filtered);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load today's withdrawals.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = withdrawals.filter((w) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      w.user?.name.toLowerCase().includes(q) ||
      w.user?.email?.toLowerCase().includes(q) ||
      w.trxId.toLowerCase().includes(q) ||
      w.method.toLowerCase().includes(q);
    const itemDate = new Date(w.createdAt);
    const matchesStart = !startDate || itemDate >= new Date(startDate);
    const matchesEnd = !endDate || itemDate <= new Date(endDate + "T23:59:59");
    return matchesSearch && matchesStart && matchesEnd;
  });

  const totalAmount = withdrawals.reduce((sum, w) => sum + w.amount, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Today Approved Withdrawals</h1>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Today Approved Withdrawals</h1>
        <div className="rounded-xl bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Today Approved Withdrawals</h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString("en-PK", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Approved</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{withdrawals.length}</p>
          <p className="text-xs text-gray-400">withdrawals today</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Amount</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            Rs {totalAmount.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400">paid out today</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Unique Users</p>
          <p className="mt-1 text-2xl font-bold text-purple-600">
            {new Set(withdrawals.map((w) => w.userId)).size}
          </p>
          <p className="text-xs text-gray-400">users paid today</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <input
          type="text"
          placeholder="Email / Username / TRX ID"
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

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-3 text-sm font-medium text-gray-500">No approved withdrawals today</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">#</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Gateway | Transaction</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Approved At</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">User</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Amount</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((w, index) => (
                  <tr key={w.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-400">{index + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-blue-600">{formatMethod(w.method)}</p>
                      <p className="font-mono text-xs text-gray-500">{w.trxId}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="text-sm text-gray-700">
                        {new Date(w.updatedAt).toLocaleString("en-PK", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs text-gray-400">{timeAgo(w.updatedAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-blue-600">@{w.user?.name || "unknown"}</p>
                      <p className="text-xs text-gray-400">{w.user?.email || ""}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="text-sm font-semibold text-gray-800">
                        Rs {w.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-green-300 bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                        Approved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Footer total row */}
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                    Total Paid Out Today:
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-bold text-green-700">
                    Rs {totalAmount.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
