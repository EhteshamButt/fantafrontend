"use client";

import { useEffect, useState } from "react";
import { adminApi, PaymentRecord } from "@/lib/api";
import ScreenshotModal from "../components/ScreenshotModal";

export default function NewRequestsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getPendingPayments()
      .then(setPayments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    setActionId(id);
    try {
      await adminApi.updatePaymentStatus(id, status);
      setPayments((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to update payment status");
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">New User Requests</h1>
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">New User Requests</h1>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
          {payments.length} pending
        </span>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-3 text-sm font-medium text-gray-500">
            No pending requests
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">User</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Package</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">TRX ID</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Sender #</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Screenshot</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">
                          {p.user?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {p.user?.email || ""}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                      {p.packageName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-800">
                      Rs{p.amount.toLocaleString("en-PK")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-600">
                      {p.trxId}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                      {p.senderNumber}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setScreenshotUrl(p.screenshotUrl)}
                        className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        View
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString("en-PK", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(p.id, "approved")}
                          disabled={actionId === p.id}
                          className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-600 disabled:opacity-50"
                        >
                          {actionId === p.id ? "..." : "Approve"}
                        </button>
                        <button
                          onClick={() => handleAction(p.id, "rejected")}
                          disabled={actionId === p.id}
                          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                        >
                          {actionId === p.id ? "..." : "Reject"}
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

      {screenshotUrl && (
        <ScreenshotModal
          url={screenshotUrl}
          onClose={() => setScreenshotUrl(null)}
        />
      )}
    </div>
  );
}
