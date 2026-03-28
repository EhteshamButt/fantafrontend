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

export default function WithdrawalRequestsPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getPendingWithdrawals()
      .then(setWithdrawals)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    setActionId(id);
    try {
      await adminApi.updateWithdrawalStatus(id, status);
      setWithdrawals((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to update withdrawal status");
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Pending Withdrawals</h1>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Pending Withdrawals</h1>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
          {withdrawals.length} pending
        </span>
      </div>

      {withdrawals.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-3 text-sm font-medium text-gray-500">No pending withdrawal requests</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Gateway | Transaction</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Initiated</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">User</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Amount</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Conversion</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-blue-600">{formatMethod(w.method)}</p>
                      <p className="font-mono text-xs text-gray-500">{w.trxId}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="text-sm text-gray-700">
                        {new Date(w.createdAt).toLocaleString("en-PK", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs text-gray-400">{timeAgo(w.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-blue-600">
                        @{w.user?.name || "unknown"}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="text-sm text-gray-700">
                        Rs{w.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} - 0.00
                      </p>
                      <p className="text-xs font-semibold text-gray-800">
                        {w.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="text-sm text-gray-700">1 Rs = 1.00 PKR</p>
                      <p className="text-xs font-semibold text-gray-800">
                        {w.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} PKR
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                        Pending
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(w.id, "approved")}
                          disabled={actionId === w.id}
                          className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-600 disabled:opacity-50"
                        >
                          {actionId === w.id ? "..." : "Approve"}
                        </button>
                        <button
                          onClick={() => handleAction(w.id, "rejected")}
                          disabled={actionId === w.id}
                          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                        >
                          {actionId === w.id ? "..." : "Reject"}
                        </button>
                      </div>
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
