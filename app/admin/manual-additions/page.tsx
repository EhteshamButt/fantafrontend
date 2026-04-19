"use client";

import { useEffect, useState } from "react";
import { adminApi, ManualAdditionRecord } from "@/lib/api";

function formatRs(val: number) {
  return `Rs${Number(val).toLocaleString("en-PK", { minimumFractionDigits: 2 })}`;
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

type BonusFilter = "all" | "big" | "small";

export default function ManualAdditionsPage() {
  const [items, setItems] = useState<ManualAdditionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bonusFilter, setBonusFilter] = useState<BonusFilter>("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    adminApi
      .getManualAdditions(1, 1000)
      .then((data) => setItems(data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      t.user?.name?.toLowerCase().includes(q) ||
      t.user?.email?.toLowerCase().includes(q);
    const matchesBonus =
      bonusFilter === "all" ||
      (bonusFilter === "big" && t.amount >= 500) ||
      (bonusFilter === "small" && t.amount < 500);
    const matchesDate =
      !dateFilter || new Date(t.createdAt).toDateString() === new Date(dateFilter).toDateString();
    return matchesSearch && matchesBonus && matchesDate;
  });

  // Summary totals from all items (not filtered, to match screenshot showing full totals)
  const totalAdditions = items.reduce((s, t) => s + Number(t.amount), 0);
  const todayAdditions = items
    .filter((t) => isToday(t.createdAt))
    .reduce((s, t) => s + Number(t.amount), 0);
  const bigBonus = items
    .filter((t) => t.amount >= 500)
    .reduce((s, t) => s + Number(t.amount), 0);
  const smallBonus = items
    .filter((t) => t.amount < 500)
    .reduce((s, t) => s + Number(t.amount), 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Manual Additions History</h1>
        <div className="animate-pulse space-y-3">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => (
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
      <h1 className="text-2xl font-bold text-gray-800">Manual Additions History</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="relative overflow-hidden rounded-xl bg-emerald-600 p-4 text-white shadow-sm">
          <p className="text-lg font-extrabold truncate">{formatRs(totalAdditions)}</p>
          <p className="mt-1 text-xs font-medium text-emerald-100">Total Manual Additions</p>
          <div className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
        </div>
        <div className="relative overflow-hidden rounded-xl bg-orange-500 p-4 text-white shadow-sm">
          <p className="text-lg font-extrabold truncate">{formatRs(todayAdditions)}</p>
          <p className="mt-1 text-xs font-medium text-orange-100">Today&apos;s Additions</p>
          <div className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
        </div>
        <div className="relative overflow-hidden rounded-xl bg-blue-600 p-4 text-white shadow-sm">
          <p className="text-lg font-extrabold truncate">{formatRs(bigBonus)}</p>
          <p className="mt-1 text-xs font-medium text-blue-100">Big Bonus (Rs500+)</p>
          <div className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
        </div>
        <div className="relative overflow-hidden rounded-xl bg-cyan-500 p-4 text-white shadow-sm">
          <p className="text-lg font-extrabold truncate">{formatRs(smallBonus)}</p>
          <p className="mt-1 text-xs font-medium text-cyan-100">Small Bonus (Below Rs500)</p>
          <div className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Search User</label>
            <input
              type="text"
              placeholder="Username or Email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Bonus Type</label>
            <select
              value={bonusFilter}
              onChange={(e) => setBonusFilter(e.target.value as BonusFilter)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400"
            >
              <option value="all">All</option>
              <option value="big">Big Bonus (Rs500+)</option>
              <option value="small">Small Bonus (Below Rs500)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400"
            />
          </div>
          <div className="flex flex-col gap-2 sm:justify-end">
            <button
              onClick={() => { /* filters are reactive */ }}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Filter
            </button>
            <button
              onClick={() => { setSearch(""); setBonusFilter("all"); setDateFilter(""); }}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-500">No manual additions found</p>
        </div>
      ) : (
        <>
          {/* ── Desktop table (md+) ── */}
          <div className="hidden md:block overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Date</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">User</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">TRX</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Amount</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Type</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Post Balance</th>
                    <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((t) => {
                    const uname = t.user?.name?.toLowerCase().replace(/\s+/g, "") || "unknown";
                    const isBig = t.amount >= 500;
                    return (
                      <tr key={t.id} className="transition-colors hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {new Date(t.createdAt).toLocaleString("en-PK", {
                            year: "numeric", month: "2-digit", day: "2-digit",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-indigo-600">@{uname}</p>
                          <p className="text-xs text-gray-400">{t.user?.email}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-sm font-semibold text-gray-700">
                          {t.trxId}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-green-600">
                          +{formatRs(Number(t.amount))}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className={`rounded-md px-2.5 py-1 text-xs font-semibold text-white ${isBig ? "bg-blue-500" : "bg-cyan-500"}`}>
                            {isBig ? "Big Bonus" : "Small Bonus"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {formatRs(Number(t.postBalance))}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {t.remark || "—"}
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
              const uname = t.user?.name?.toLowerCase().replace(/\s+/g, "") || "unknown";
              const isBig = t.amount >= 500;
              return (
                <div key={t.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                  {[
                    {
                      label: "Date",
                      value: (
                        <span className="text-gray-700">
                          {new Date(t.createdAt).toLocaleString("en-PK", {
                            year: "numeric", month: "2-digit", day: "2-digit",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      ),
                    },
                    {
                      label: "User",
                      value: (
                        <div className="text-right">
                          <p className="font-medium text-indigo-600">@{uname}</p>
                          <p className="text-xs text-gray-400">{t.user?.email}</p>
                        </div>
                      ),
                    },
                    {
                      label: "TRX",
                      value: <span className="font-mono font-semibold text-gray-700">{t.trxId}</span>,
                    },
                    {
                      label: "Amount",
                      value: <span className="font-semibold text-green-600">+{formatRs(Number(t.amount))}</span>,
                    },
                    {
                      label: "Type",
                      value: (
                        <span className={`rounded-md px-2.5 py-1 text-xs font-semibold text-white ${isBig ? "bg-blue-500" : "bg-cyan-500"}`}>
                          {isBig ? "Big Bonus" : "Small Bonus"}
                        </span>
                      ),
                    },
                    {
                      label: "Post Balance",
                      value: <span className="text-gray-700">{formatRs(Number(t.postBalance))}</span>,
                    },
                    {
                      label: "Remark",
                      value: <span className="text-gray-500">{t.remark || "—"}</span>,
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
