"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi, TransactionRecord } from "@/lib/api";

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

export default function UserTransactionsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi
      .getUserTransactions(id)
      .then(setTransactions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const username =
    transactions[0]?.user?.referralCode ||
    transactions[0]?.user?.name?.toLowerCase().replace(/\s+/g, "") ||
    id;

  const filtered = transactions.filter((t) => {
    const q = search.toLowerCase();
    return (
      !q ||
      t.trxId.toLowerCase().includes(q) ||
      t.user?.name?.toLowerCase().includes(q) ||
      t.user?.email?.toLowerCase().includes(q) ||
      t.detail.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="animate-pulse space-y-3">
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
          <h1 className="text-xl font-bold text-gray-800">
            Transaction Logs -{" "}
            <span className="text-indigo-600">{username}</span>
          </h1>
        </div>

        <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <input
            type="text"
            placeholder="Search TRX / user / detail"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 text-sm text-gray-500 outline-none placeholder:text-gray-400 sm:w-64 sm:flex-none"
          />
          <button className="flex items-center justify-center bg-indigo-600 px-4 hover:bg-indigo-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-3 text-sm font-medium text-gray-500">No transactions found</p>
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
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">TRX / ID</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Transacted</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Amount</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Post Balance</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Referred By</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Detail</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((t) => {
                    const uname =
                      t.user?.referralCode ||
                      t.user?.name?.toLowerCase().replace(/\s+/g, "") ||
                      "unknown";
                    const refName =
                      t.referredBy?.referralCode ||
                      t.referredBy?.name?.toLowerCase().replace(/\s+/g, "");
                    return (
                      <tr key={t.id} className="transition-colors hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-indigo-600">
                          @{uname}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-semibold text-indigo-600">{t.trxId}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(t.trxId)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Copy"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-xs text-gray-400">ID:{t.id.slice(-6)}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                            t.type === "credit"
                              ? "border-green-300 bg-white text-green-600"
                              : "border-red-300 bg-white text-red-500"
                          }`}>
                            {t.type === "credit" ? "Credit" : "Debit"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold">
                          <span className={t.type === "credit" ? "text-green-600" : "text-red-500"}>
                            {t.type === "credit" ? "+" : "-"}{t.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-indigo-600">
                          {t.postBalance.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs
                        </td>
                        <td className="px-4 py-3">
                          {t.referredBy ? (
                            <>
                              <p className="text-xs text-indigo-500">{t.referredBy.email}</p>
                              {refName && <p className="text-xs text-gray-400">@ {refName}</p>}
                            </>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{t.detail}</td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <p className="text-xs text-gray-700">
                            {new Date(t.createdAt).toLocaleString("en-PK", {
                              year: "numeric", month: "2-digit", day: "2-digit",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                          <p className="text-xs text-gray-400">{timeAgo(t.createdAt)}</p>
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
            {filtered.map((t) => {
              const uname =
                t.user?.referralCode ||
                t.user?.name?.toLowerCase().replace(/\s+/g, "") ||
                "unknown";
              const refName =
                t.referredBy?.referralCode ||
                t.referredBy?.name?.toLowerCase().replace(/\s+/g, "");
              return (
                <div key={t.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                  {[
                    {
                      label: "User",
                      value: <span className="font-medium text-indigo-600">@{uname}</span>,
                    },
                    {
                      label: "TRX / ID",
                      value: (
                        <div className="text-right">
                          <p className="font-mono text-xs font-semibold text-indigo-600">{t.trxId}</p>
                          <p className="text-xs text-gray-400">ID:{t.id.slice(-6)}</p>
                        </div>
                      ),
                    },
                    {
                      label: "Transacted",
                      value: (
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          t.type === "credit"
                            ? "border-green-300 bg-white text-green-600"
                            : "border-red-300 bg-white text-red-500"
                        }`}>
                          {t.type === "credit" ? "Credit" : "Debit"}
                        </span>
                      ),
                    },
                    {
                      label: "Amount",
                      value: (
                        <span className={`font-semibold ${t.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                          {t.type === "credit" ? "+" : "-"}{t.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs
                        </span>
                      ),
                    },
                    {
                      label: "Post Balance",
                      value: (
                        <span className="font-semibold text-indigo-600">
                          {t.postBalance.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs
                        </span>
                      ),
                    },
                    {
                      label: "Referred By",
                      value: t.referredBy ? (
                        <div className="text-right">
                          <p className="text-xs text-indigo-500">{t.referredBy.email}</p>
                          {refName && <p className="text-xs text-gray-400">@ {refName}</p>}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      ),
                    },
                    {
                      label: "Detail",
                      value: <span className="text-gray-600">{t.detail}</span>,
                    },
                    {
                      label: "Date",
                      value: (
                        <div className="text-right">
                          <p className="text-xs text-gray-700">
                            {new Date(t.createdAt).toLocaleString("en-PK", {
                              year: "numeric", month: "2-digit", day: "2-digit",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                          <p className="text-xs text-gray-400">{timeAgo(t.createdAt)}</p>
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
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
