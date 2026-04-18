"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi, PaymentRecord } from "@/lib/api";
import ScreenshotModal from "../../components/ScreenshotModal";

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

export default function UserDepositsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [deposits, setDeposits] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getUserDeposits(id)
      .then(setDeposits)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const username =
    (deposits[0]?.user as (PaymentRecord["user"] & { referralCode?: string }) | undefined)?.referralCode ||
    deposits[0]?.user?.name?.toLowerCase().replace(/\s+/g, "") ||
    id;

  const filtered = deposits.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.user?.name?.toLowerCase().includes(q) ||
      p.user?.email?.toLowerCase().includes(q) ||
      p.trxId.toLowerCase().includes(q) ||
      p.packageName.toLowerCase().includes(q);
    const itemDate = new Date(p.createdAt);
    const matchesStart = !startDate || itemDate >= new Date(startDate);
    const matchesEnd = !endDate || itemDate <= new Date(endDate + "T23:59:59");
    return matchesSearch && matchesStart && matchesEnd;
  });

  const successAmount = deposits.filter((p) => p.status === "approved").reduce((s, p) => s + p.amount, 0);
  const pendingAmount = deposits.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const rejectedAmount = deposits.filter((p) => p.status === "rejected").reduce((s, p) => s + p.amount, 0);
  const totalAmount = deposits.reduce((s, p) => s + p.amount, 0);

  const statusBadge = (status: PaymentRecord["status"], updatedAt: string) => {
    const color =
      status === "approved"
        ? "border-green-400 text-green-600"
        : status === "pending"
        ? "border-orange-400 text-orange-500"
        : "border-red-400 text-red-500";
    return (
      <div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${color}`}>
          {status}
        </span>
        <p className="mt-1 text-xs text-gray-400">{timeAgo(updatedAt)}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200" />)}
        </div>
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-gray-200" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-xl font-bold text-gray-800">Deposit History</h1>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Date range filter */}
          <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-1 items-center gap-1 px-3 py-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-sm text-gray-500 outline-none"
              />
              <span className="text-gray-400">–</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-sm text-gray-500 outline-none"
              />
            </div>
            <button className="flex items-center justify-center bg-indigo-600 px-4 hover:bg-indigo-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
            </button>
          </div>
          {/* Text search */}
          <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <input
              type="text"
              placeholder={username}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 text-sm text-gray-500 outline-none placeholder:text-gray-400 sm:w-44"
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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Successful Deposit", value: successAmount, bg: "bg-green-500" },
          { label: "Pending Deposit",    value: pendingAmount,  bg: "bg-orange-400" },
          { label: "Rejected Deposit",   value: rejectedAmount, bg: "bg-pink-600" },
          { label: "Initiated Deposit",  value: totalAmount,    bg: "bg-indigo-900" },
        ].map((card) => (
          <div key={card.label} className={`rounded-xl ${card.bg} p-4 text-white shadow-sm`}>
            <p className="text-xl font-bold">
              Rs{card.value.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
            </p>
            <p className="mt-1 text-xs font-medium text-white/80">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-3 text-sm font-medium text-gray-500">No deposits found</p>
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
                  {filtered.map((p) => {
                    const uname =
                      (p.user as (PaymentRecord["user"] & { referralCode?: string }) | undefined)?.referralCode ||
                      p.user?.name?.toLowerCase().replace(/\s+/g, "") ||
                      "unknown";
                    return (
                      <tr key={p.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-indigo-600">{p.packageName}</p>
                          <p className="font-mono text-xs text-gray-500">{p.trxId}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <p className="text-sm text-gray-700">
                            {new Date(p.createdAt).toLocaleString("en-PK", {
                              year: "numeric", month: "2-digit", day: "2-digit",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                          <p className="text-xs text-gray-400">{timeAgo(p.createdAt)}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-indigo-600">
                          @{uname}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <p className="text-sm text-gray-700">
                            Rs{p.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })}{" "}
                            <span className="text-orange-500">+ 0.00</span>
                          </p>
                          <p className="text-xs font-semibold text-gray-800">
                            {p.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <p className="text-sm text-gray-700">1 Rs = 1.00 PKR</p>
                          <p className="text-xs font-semibold text-gray-800">
                            {p.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} PKR
                          </p>
                        </td>
                        <td className="px-4 py-3">{statusBadge(p.status, p.updatedAt)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setScreenshotUrl(p.screenshotUrl)}
                            className="flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
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
            {filtered.map((p) => {
              const uname =
                (p.user as (PaymentRecord["user"] & { referralCode?: string }) | undefined)?.referralCode ||
                p.user?.name?.toLowerCase().replace(/\s+/g, "") ||
                "unknown";
              return (
                <div key={p.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                  {[
                    {
                      label: "Gateway",
                      value: (
                        <div className="text-right">
                          <p className="font-semibold text-indigo-600">{p.packageName}</p>
                          <p className="font-mono text-xs text-gray-500">{p.trxId}</p>
                        </div>
                      ),
                    },
                    {
                      label: "Initiated",
                      value: (
                        <div className="text-right">
                          <p className="text-gray-700">
                            {new Date(p.createdAt).toLocaleString("en-PK", {
                              year: "numeric", month: "2-digit", day: "2-digit",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                          <p className="text-xs text-gray-400">{timeAgo(p.createdAt)}</p>
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
                            Rs{p.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })}{" "}
                            <span className="text-orange-500">+ 0.00</span>
                          </p>
                          <p className="text-xs font-semibold text-gray-800">
                            {p.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs
                          </p>
                        </div>
                      ),
                    },
                    {
                      label: "Conversion",
                      value: (
                        <div className="text-right">
                          <p className="text-gray-700">1 Rs = 1.00 PKR</p>
                          <p className="text-xs font-semibold text-gray-800">
                            {p.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} PKR
                          </p>
                        </div>
                      ),
                    },
                    {
                      label: "Status",
                      value: statusBadge(p.status, p.updatedAt),
                    },
                    {
                      label: "Action",
                      value: (
                        <button
                          onClick={() => setScreenshotUrl(p.screenshotUrl)}
                          className="flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
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

      {screenshotUrl && (
        <ScreenshotModal url={screenshotUrl} onClose={() => setScreenshotUrl(null)} />
      )}
    </div>
  );
}
