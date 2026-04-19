"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

function formatRs(val: number) {
  return `Rs${val.toLocaleString("en-PK", { minimumFractionDigits: 2 })}`;
}

function formatMethod(m: string) {
  return m === "easypaisa" ? "Easypaisa" : m === "jazzcash" ? "Jazzcash" : m;
}

export default function WithdrawalsLogPage() {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    adminApi
      .getAllWithdrawals()
      .then(setWithdrawals)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = withdrawals.filter((w) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      w.user?.name?.toLowerCase().includes(q) ||
      w.user?.email?.toLowerCase().includes(q) ||
      w.trxId?.toLowerCase().includes(q);
    const itemDate = new Date(w.createdAt);
    const matchesStart = !startDate || itemDate >= new Date(startDate);
    const matchesEnd = !endDate || itemDate <= new Date(endDate + "T23:59:59");
    return matchesSearch && matchesStart && matchesEnd;
  });

  // Summary totals from filtered data
  const approvedTotal = filtered.filter((w) => w.status === "approved").reduce((s, w) => s + w.amount, 0);
  const pendingTotal = filtered.filter((w) => w.status === "pending").reduce((s, w) => s + w.amount, 0);
  const rejectedTotal = filtered.filter((w) => w.status === "rejected").reduce((s, w) => s + w.amount, 0);

  function getDetailRoute(w: WithdrawalRecord) {
    if (w.status === "approved") return `/admin/today-withdrawal/${w.id}`;
    return `/admin/withdrawal-requests/${w.id}`;
  }

  function getSessionKey(w: WithdrawalRecord) {
    if (w.status === "approved") return `tw_${w.id}`;
    return `withdrawal_${w.id}`;
  }

  const statusBadge = {
    approved: "rounded-full border border-green-400 px-3 py-1 text-xs font-semibold text-green-600",
    pending: "rounded-full border border-orange-400 px-3 py-1 text-xs font-semibold text-orange-500",
    rejected: "rounded-full border border-red-400 px-3 py-1 text-xs font-semibold text-red-500",
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Withdrawals Log</h1>
        <div className="animate-pulse space-y-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-gray-200" />
            ))}
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Withdrawals Log</h1>

        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Date range */}
          <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-1 items-center gap-1 px-3 py-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-sm text-gray-500 outline-none"
                placeholder="Start Date"
              />
              <span className="text-gray-400">–</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-sm text-gray-500 outline-none"
                placeholder="End Date"
              />
            </div>
            <button className="flex items-center justify-center bg-indigo-600 px-4 hover:bg-indigo-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
            </button>
          </div>
          {/* TRX ID search */}
          <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <input
              type="text"
              placeholder="TRX ID / Email / Username"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 text-sm text-gray-500 outline-none placeholder:text-gray-400 sm:w-52"
            />
            <button className="flex items-center justify-center bg-indigo-600 px-4 hover:bg-indigo-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Approved */}
        <div className="relative overflow-hidden rounded-xl bg-emerald-500 p-5 text-white shadow-sm">
          <p className="text-3xl font-extrabold truncate">{formatRs(approvedTotal)}</p>
          <p className="mt-1 text-sm font-medium text-emerald-100">Approved Withdrawals</p>
          <div className="pointer-events-none absolute -bottom-5 -right-5 h-24 w-24 rounded-full bg-white/10" />
        </div>
        {/* Pending */}
        <div className="relative overflow-hidden rounded-xl bg-orange-400 p-5 text-white shadow-sm">
          <p className="text-3xl font-extrabold truncate">{formatRs(pendingTotal)}</p>
          <p className="mt-1 text-sm font-medium text-orange-100">Pending Withdrawals</p>
          <div className="pointer-events-none absolute -bottom-5 -right-5 h-24 w-24 rounded-full bg-white/10" />
        </div>
        {/* Rejected */}
        <div className="relative overflow-hidden rounded-xl bg-rose-500 p-5 text-white shadow-sm">
          <p className="text-3xl font-extrabold truncate">{formatRs(rejectedTotal)}</p>
          <p className="mt-1 text-sm font-medium text-rose-100">Rejected Withdrawals</p>
          <div className="pointer-events-none absolute -bottom-5 -right-5 h-24 w-24 rounded-full bg-white/10" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-500">No withdrawal records found</p>
        </div>
      ) : (
        <>
          {/* ── Desktop table (md+) ── */}
          <div className="hidden md:block overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Gateway | Transaction</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Initiated</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">User</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Amount</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Conversion</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((w) => {
                    const uname =
                      w.user?.name?.toLowerCase().replace(/\s+/g, "") || "unknown";
                    return (
                      <tr key={w.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-indigo-600">{formatMethod(w.method)}</p>
                          <p className="font-mono text-xs text-gray-500">{w.trxId}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <p className="text-sm text-gray-700">
                            {new Date(w.createdAt).toLocaleString("en-PK", {
                              year: "numeric", month: "2-digit", day: "2-digit",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                          <p className="text-xs text-gray-400">{timeAgo(w.createdAt)}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-indigo-600">
                          @{uname}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <p className="text-sm text-gray-700">
                            Rs{w.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })}{" "}
                            <span className="text-red-500">- 0.00</span>
                          </p>
                          <p className="text-xs font-semibold text-gray-800">
                            {w.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <p className="text-sm text-gray-700">1 Rs = 1.00 Pkr</p>
                          <p className="text-xs font-semibold text-gray-800">
                            {w.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Pkr
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className={statusBadge[w.status]}>
                              {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                            </span>
                            <p className="mt-1 text-xs text-gray-400">{timeAgo(w.updatedAt)}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              sessionStorage.setItem(getSessionKey(w), JSON.stringify(w));
                              router.push(getDetailRoute(w));
                            }}
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
            {filtered.map((w) => {
              const uname = w.user?.name?.toLowerCase().replace(/\s+/g, "") || "unknown";
              return (
                <div key={w.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                  {[
                    {
                      label: "Gateway",
                      value: (
                        <div className="text-right">
                          <p className="font-semibold text-indigo-600">{formatMethod(w.method)}</p>
                          <p className="font-mono text-xs text-gray-500">{w.trxId}</p>
                        </div>
                      ),
                    },
                    {
                      label: "Initiated",
                      value: (
                        <div className="text-right">
                          <p className="text-gray-700">
                            {new Date(w.createdAt).toLocaleString("en-PK", {
                              year: "numeric", month: "2-digit", day: "2-digit",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                          <p className="text-xs text-gray-400">{timeAgo(w.createdAt)}</p>
                        </div>
                      ),
                    },
                    {
                      label: "User",
                      value: <span className="font-medium text-indigo-600">@{uname}</span>,
                    },
                    {
                      label: "Amount",
                      value: (
                        <div className="text-right">
                          <p className="text-gray-700">
                            Rs{w.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })}{" "}
                            <span className="text-red-500">- 0.00</span>
                          </p>
                          <p className="text-xs font-semibold text-gray-800">
                            {w.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs
                          </p>
                        </div>
                      ),
                    },
                    {
                      label: "Conversion",
                      value: (
                        <div className="text-right">
                          <p className="text-gray-700">1 Rs = 1.00 Pkr</p>
                          <p className="text-xs font-semibold text-gray-800">
                            {w.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Pkr
                          </p>
                        </div>
                      ),
                    },
                    {
                      label: "Status",
                      value: (
                        <div className="text-right">
                          <span className={statusBadge[w.status]}>
                            {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                          </span>
                          <p className="mt-1 text-xs text-gray-400">{timeAgo(w.updatedAt)}</p>
                        </div>
                      ),
                    },
                    {
                      label: "Action",
                      value: (
                        <button
                          onClick={() => {
                            sessionStorage.setItem(getSessionKey(w), JSON.stringify(w));
                            router.push(getDetailRoute(w));
                          }}
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
