"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function TodayWithdrawalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [withdrawal, setWithdrawal] = useState<WithdrawalRecord | null>(null);
  const [phone, setPhone] = useState("");
  const [teamCount, setTeamCount] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const applyWithdrawal = (w: WithdrawalRecord) => {
    setWithdrawal(w);
    if (w.userId) {
      adminApi
        .getUserDetail(w.userId)
        .then(({ user, stats }) => {
          setPhone(user.phone || "");
          setTeamCount(stats.teamCount);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    // 1. Try sessionStorage (key: tw_{id})
    const cached = sessionStorage.getItem(`tw_${id}`);
    if (cached) {
      try {
        applyWithdrawal(JSON.parse(cached));
        return;
      } catch { /* fall through */ }
    }

    // 2. Fallback: fetch today's approved list
    adminApi
      .getTodayApprovedWithdrawals()
      .then((list) => {
        const found = list.find((w) => w.id === id);
        if (found) {
          sessionStorage.setItem(`tw_${id}`, JSON.stringify(found));
          applyWithdrawal(found);
        } else {
          // 3. Try all withdrawals
          return adminApi.getAllWithdrawals().then((all) => {
            const w = all.find((x) => x.id === id);
            if (w) {
              sessionStorage.setItem(`tw_${id}`, JSON.stringify(w));
              applyWithdrawal(w);
            }
          });
        }
      })
      .catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRejectSubmit = async () => {
    if (!withdrawal) return;
    setActionLoading(true);
    setActionMsg("");
    try {
      await adminApi.updateWithdrawalStatus(withdrawal.id, "rejected");
      const updated = { ...withdrawal, status: "rejected" as const, updatedAt: new Date().toISOString() };
      sessionStorage.setItem(`tw_${id}`, JSON.stringify(updated));
      setWithdrawal(updated);
      setRejectModal(false);
      setRejectReason("");
      setActionMsg("Rejection recorded.");
    } catch {
      setActionMsg("Failed to reject.");
    } finally {
      setActionLoading(false);
    }
  };

  if (!withdrawal) {
    return (
      <div className="rounded-xl bg-green-50 p-8 text-center">
        <p className="text-base font-semibold text-green-600">Loading withdrawal details...</p>
        <button
          onClick={() => router.push("/admin/today-withdrawal")}
          className="mt-4 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Go to Today&apos;s Withdrawals
        </button>
      </div>
    );
  }

  const username = withdrawal.user?.name?.toLowerCase().replace(/\s+/g, "") || "unknown";
  const charge = 0;
  const afterCharge = withdrawal.amount - charge;

  const detailRows: { label: string; value: React.ReactNode }[] = [
    {
      label: "Date",
      value: new Date(withdrawal.createdAt).toLocaleString("en-PK", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit",
      }),
    },
    {
      label: "Total Team",
      value: teamCount !== null ? teamCount : <span className="text-gray-400 italic">Loading...</span>,
    },
    { label: "Trx Number", value: <span className="font-mono">{withdrawal.trxId}</span> },
    { label: "Username", value: <span className="text-indigo-600">@{username}</span> },
    { label: "Name", value: withdrawal.user?.name || "Unknown" },
    { label: "Email", value: withdrawal.user?.email || "—" },
    {
      label: "Mobile",
      value: phone || <span className="text-gray-400 italic">Loading...</span>,
    },
    { label: "Method", value: formatMethod(withdrawal.method) },
    {
      label: "Amount",
      value: `Rs ${withdrawal.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })}`,
    },
    { label: "Charge", value: `Rs ${charge.toFixed(2)}` },
    {
      label: "After Charge",
      value: `Rs ${afterCharge.toLocaleString("en-PK", { minimumFractionDigits: 2 })}`,
    },
    { label: "Rate", value: "1 Rs = 1.00 PKR" },
    {
      label: "Payable",
      value: (
        <span className="font-semibold text-gray-900">
          Rs {afterCharge.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      label: "Status",
      value: (
        <div className="flex flex-col items-end gap-1">
          <span
            className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${
              withdrawal.status === "approved"
                ? "border-green-400 text-green-600"
                : withdrawal.status === "rejected"
                ? "border-red-400 text-red-600"
                : "border-orange-400 text-orange-500"
            }`}
          >
            {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
          </span>
          <span className="text-xs text-gray-400">{timeAgo(withdrawal.updatedAt)}</span>
        </div>
      ),
    },
    { label: "Admin Response", value: <span className="text-gray-400">—</span> },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          <span className="text-indigo-600">@{username}</span> requested{" "}
          {withdrawal.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs
        </h1>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left: Withdrawal detail rows */}
        <div className="rounded-2xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-bold text-gray-800">
              Withdraw Via{" "}
              <span className="text-indigo-600">{formatMethod(withdrawal.method)}</span>
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {detailRows.map((row, i) => (
              <div key={i} className="flex items-start justify-between px-6 py-3">
                <span className="min-w-[130px] text-sm font-medium text-gray-500">
                  {row.label}
                </span>
                <div className="text-right text-sm text-gray-800">{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: User info + Action */}
        <div className="flex flex-col gap-5">
          {/* User Withdraw Information */}
          <div className="rounded-2xl bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-base font-bold text-gray-800">User Withdraw Information</h2>
            </div>
            <div className="divide-y divide-gray-50">
              <div className="flex items-center justify-between px-6 py-3">
                <span className="text-sm font-medium text-gray-500">Account Name</span>
                <span className="text-sm text-gray-800">{withdrawal.user?.name || "Unknown"}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-3">
                <span className="text-sm font-medium text-gray-500">Account Number</span>
                <span className="font-mono text-sm text-gray-800">
                  {phone || <span className="text-gray-400 italic">Loading...</span>}
                </span>
              </div>
            </div>
          </div>

          {/* Action panel */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
            {actionMsg && (
              <p
                className={`text-center text-sm font-medium ${
                  actionMsg.includes("Rejection") ? "text-red-500" : "text-green-600"
                }`}
              >
                {actionMsg}
              </p>
            )}

            {withdrawal.status === "approved" && (
              <p className="text-center text-sm font-semibold text-green-600">
                This withdrawal has been approved.
              </p>
            )}

            {/* Allow reject even on approved (admin override) */}
            {withdrawal.status !== "rejected" && (
              <button
                onClick={() => setRejectModal(true)}
                disabled={actionLoading}
                className="w-full rounded-xl bg-red-500 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60 transition-colors"
              >
                Reject
              </button>
            )}

            {withdrawal.status === "rejected" && (
              <p className="text-center text-sm font-semibold text-red-500">
                This withdrawal has been rejected.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-base font-bold text-gray-800">Reject Withdrawal</h3>
            <p className="mb-4 text-sm text-gray-500">
              Provide a reason for rejecting this approved withdrawal.
            </p>
            <textarea
              rows={4}
              placeholder="Reason for rejection (optional)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-colors"
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => { setRejectModal(false); setRejectReason(""); }}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={actionLoading}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60 transition-colors"
              >
                {actionLoading ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
