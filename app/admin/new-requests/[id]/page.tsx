"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi, PaymentRecord } from "@/lib/api";

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

interface UserDetail {
  phone: string | null;
  referredBy: string | null;
}

export default function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    adminApi
      .getPaymentById(id)
      .then((p) => {
        setPayment(p);
        // Also fetch user detail for phone + referredBy
        if (p.userId) {
          adminApi
            .getUserDetail(p.userId)
            .then(({ user }) =>
              setUserDetail({ phone: user.phone, referredBy: user.referredBy })
            )
            .catch(() => {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (status: "approved" | "rejected" | "pending") => {
    if (!payment) return;
    setActionId(status);
    try {
      await adminApi.updatePaymentStatus(payment.id, status);
      setPayment((prev) => prev ? { ...prev, status: status === "pending" ? "pending" : status } : prev);
    } catch {
      alert("Failed to update status.");
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-72 rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-96 rounded-xl bg-gray-200" />
          <div className="h-96 rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="rounded-xl bg-red-50 p-8 text-center">
        <p className="text-red-600">Payment not found.</p>
        <button onClick={() => router.back()} className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white">
          Go Back
        </button>
      </div>
    );
  }

  const username =
    (payment.user as (PaymentRecord["user"] & { referralCode?: string }) | undefined)?.referralCode ||
    payment.user?.name?.toLowerCase().replace(/\s+/g, "") ||
    "unknown";

  const statusColor =
    payment.status === "approved"
      ? "border-green-400 text-green-600"
      : payment.status === "pending"
      ? "border-orange-400 text-orange-500"
      : "border-red-400 text-red-500";

  const detailRows = [
    { label: "Date", value: new Date(payment.createdAt).toLocaleString("en-PK", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) },
    { label: "Referred By", value: userDetail?.referredBy || "N/a" },
    { label: "Transaction Number", value: payment.trxId },
    { label: "Username", value: <span className="font-medium text-indigo-600">@{username}</span> },
    { label: "Name", value: payment.user?.name || "—" },
    { label: "Email", value: <span className="text-indigo-600">{payment.user?.email || "—"}</span> },
    { label: "Mobile", value: userDetail?.phone || "—" },
    { label: "Method", value: <span className="font-medium text-indigo-600">{payment.packageName}</span> },
    { label: "Amount", value: `${payment.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs` },
    { label: "Charge", value: "0.00 Rs" },
    { label: "After Charge", value: `${payment.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs` },
    { label: "Rate", value: "1 Rs = 1.00 PKR" },
    { label: "Payable", value: `${payment.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} PKR` },
    {
      label: "Status",
      value: (
        <div className="text-right">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusColor}`}>
            {payment.status}
          </span>
          <p className="mt-1 text-xs text-gray-400">{timeAgo(payment.updatedAt)}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
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
          <span className="text-indigo-600">@{username}</span> requested{" "}
          {payment.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs
        </h1>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* Left: Deposit Details */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-600">Deposit Via {payment.packageName}</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {detailRows.map((row, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-gray-500">{row.label}</span>
                <div className="text-right text-sm font-medium text-gray-800">{row.value}</div>
              </div>
            ))}
            {/* Admin Response */}
            <div className="px-5 py-4">
              <p className="mb-2 text-sm font-bold text-gray-700">Admin Response</p>
              <textarea
                rows={2}
                placeholder="Write admin response..."
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              />
            </div>
          </div>
        </div>

        {/* Right: Screenshot + Actions */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-600">User Deposit Information</h2>
          </div>
          <div className="p-5 space-y-4">
            {/* Screenshot */}
            <div>
              <p className="mb-2 text-xs font-semibold text-gray-500">payment_screenshot</p>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                {!imgError ? (
                  <img
                    src={payment.screenshotUrl}
                    alt="Payment Screenshot"
                    className="max-h-80 w-full object-contain"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center text-sm text-gray-400">
                    Image not available
                  </div>
                )}
              </div>
            </div>

            {/* View / Download buttons */}
            <div className="flex gap-2">
              <a
                href={payment.screenshotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Full Size
              </a>
              <a
                href={payment.screenshotUrl}
                download
                className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
            </div>

            {/* Meta */}
            <div className="space-y-2">
              <div>
                <p className="text-xs font-semibold text-gray-500">transaction_id</p>
                <p className="mt-0.5 font-mono text-sm text-gray-700">{payment.trxId}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">sender_number</p>
                <p className="mt-0.5 font-mono text-sm text-gray-700">{payment.senderNumber}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              {payment.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction("approved")}
                    disabled={!!actionId}
                    className="flex-1 rounded-lg bg-green-500 py-2.5 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50 transition-colors"
                  >
                    {actionId === "approved" ? "Approving..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleAction("rejected")}
                    disabled={!!actionId}
                    className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                  >
                    {actionId === "rejected" ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              )}
              {payment.status === "rejected" && (
                <button
                  onClick={() => handleAction("pending")}
                  disabled={!!actionId}
                  className="w-full rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {actionId === "pending" ? "Processing..." : "Re-Approve (Move to Pending)"}
                </button>
              )}
              {payment.status === "approved" && (
                <div className="rounded-lg bg-green-50 border border-green-200 py-2.5 text-center text-sm font-semibold text-green-600">
                  Payment Approved
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
