"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi, PaymentRecord } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://fantaapi.netlify.app/api";

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

export default function RejectedDepositDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [phone, setPhone] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [screenshotModal, setScreenshotModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const applyPayment = (p: PaymentRecord) => {
    setPayment(p);
    if (p.userId) {
      adminApi
        .getUserDetail(p.userId)
        .then(({ user }) => {
          setPhone(user.phone || "");
          setReferredBy(user.referredBy || "");
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    // 1. Try sessionStorage
    const cached = sessionStorage.getItem(`rejected_${id}`);
    if (cached) {
      try {
        applyPayment(JSON.parse(cached));
        return;
      } catch { /* fall through */ }
    }

    // 2. Fallback: fetch by ID
    adminApi
      .getPaymentById(id)
      .then((p) => {
        sessionStorage.setItem(`rejected_${id}`, JSON.stringify(p));
        applyPayment(p);
      })
      .catch(() => {
        // 3. Scan rejected list
        adminApi
          .getRejectedUsers()
          .then((list) => {
            const found = (list as PaymentRecord[]).find((x) => x.id === id);
            if (found) {
              sessionStorage.setItem(`rejected_${id}`, JSON.stringify(found));
              applyPayment(found);
            }
          })
          .catch(console.error);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleApprove = async () => {
    if (!payment) return;
    setActionLoading(true);
    setActionMsg("");
    try {
      await adminApi.updatePaymentStatus(payment.id, "approved");
      const updated = { ...payment, status: "approved" as const, updatedAt: new Date().toISOString() };
      sessionStorage.setItem(`rejected_${id}`, JSON.stringify(updated));
      setPayment(updated);
      setActionMsg("Re-approved successfully!");
    } catch {
      setActionMsg("Failed to approve.");
    } finally {
      setActionLoading(false);
    }
  };

  if (!payment) {
    return (
      <div className="rounded-xl bg-red-50 p-8 text-center">
        <p className="text-base font-semibold text-red-600">Loading deposit details...</p>
        <button
          onClick={() => router.push("/admin/rejected-users")}
          className="mt-4 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Go to Rejected Deposits
        </button>
      </div>
    );
  }

  const username = payment.user?.name?.toLowerCase().replace(/\s+/g, "") || "unknown";
  const charge = 0;
  const afterCharge = payment.amount - charge;
  const screenshotSrc = payment.screenshotUrl
    ? payment.screenshotUrl.startsWith("http")
      ? payment.screenshotUrl
      : `${API_URL.replace("/api", "")}/${payment.screenshotUrl.replace(/^\//, "")}`
    : null;

  const detailRows: { label: string; value: React.ReactNode }[] = [
    {
      label: "Date",
      value: new Date(payment.createdAt).toLocaleString("en-PK", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit",
      }),
    },
    {
      label: "Referred By",
      value: referredBy ? (
        <span className="text-indigo-600">{referredBy}</span>
      ) : (
        <span className="text-gray-400">—</span>
      ),
    },
    {
      label: "Transaction Number",
      value: <span className="font-mono">{payment.trxId}</span>,
    },
    {
      label: "Username",
      value: <span className="text-indigo-600">{username}</span>,
    },
    { label: "Name", value: payment.user?.name || "—" },
    { label: "Email", value: payment.user?.email || "—" },
    {
      label: "Mobile",
      value: phone || <span className="text-gray-400 italic">Loading...</span>,
    },
    { label: "Method", value: payment.packageName },
    {
      label: "Amount",
      value: `${payment.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs`,
    },
    { label: "Charge", value: `${charge.toFixed(2)} Rs` },
    {
      label: "After Charge",
      value: `${afterCharge.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs`,
    },
    { label: "Rate", value: "1 Rs = 1.00 PKR" },
    {
      label: "Payable",
      value: (
        <span className="font-semibold text-gray-900">
          {afterCharge.toLocaleString("en-PK", { minimumFractionDigits: 2 })} PKR
        </span>
      ),
    },
    {
      label: "Status",
      value: (
        <div className="flex flex-col items-end gap-1">
          <span
            className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${
              payment.status === "approved"
                ? "border-green-400 text-green-600"
                : payment.status === "rejected"
                ? "border-red-400 text-red-600"
                : "border-orange-400 text-orange-500"
            }`}
          >
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </span>
          <span className="text-xs text-gray-400">{timeAgo(payment.updatedAt)}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          {username} requested{" "}
          {payment.amount.toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs
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
        {/* Left: Deposit detail rows */}
        <div className="rounded-2xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-bold text-gray-800">
              Deposit Via <span className="text-indigo-600">{payment.packageName}</span>
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {detailRows.map((row, i) => (
              <div key={i} className="flex items-start justify-between px-6 py-3">
                <span className="min-w-[150px] text-sm font-medium text-gray-500">
                  {row.label}
                </span>
                <div className="text-right text-sm text-gray-800">{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: User Deposit Information + Actions */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-base font-bold text-gray-800">User Deposit Information</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Screenshot */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  payment_screenshot
                </p>
                {screenshotSrc ? (
                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    <img
                      src={screenshotSrc}
                      alt="Payment screenshot"
                      className="w-full cursor-pointer object-cover"
                      onClick={() => setScreenshotModal(true)}
                    />
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-400">No screenshot uploaded</p>
                  </div>
                )}
              </div>

              {/* View Full Size / Download */}
              {screenshotSrc && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setScreenshotModal(true)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Full Size
                  </button>
                  <a
                    href={screenshotSrc}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                </div>
              )}

              {/* transaction_id */}
              <div className="pt-2">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  transaction_id
                </p>
                <p className="font-mono text-sm text-gray-800">{payment.trxId || "—"}</p>
              </div>

              {/* sender_number */}
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  sender_number
                </p>
                <p className="font-mono text-sm text-gray-800">
                  {payment.senderNumber || phone || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
            {actionMsg && (
              <p
                className={`text-center text-sm font-medium ${
                  actionMsg.includes("success") ? "text-green-600" : "text-red-500"
                }`}
              >
                {actionMsg}
              </p>
            )}

            {payment.status === "rejected" && (
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="w-full rounded-xl bg-green-500 py-3 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60 transition-colors"
              >
                {actionLoading ? "Processing..." : "Re-Approve"}
              </button>
            )}

            {payment.status === "approved" && (
              <p className="text-center text-sm font-semibold text-green-600">
                This deposit has been re-approved.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Screenshot fullscreen modal */}
      {screenshotModal && screenshotSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setScreenshotModal(false)}
        >
          <div className="relative max-h-[90vh] max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setScreenshotModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-sm font-semibold"
            >
              ✕ Close
            </button>
            <img
              src={screenshotSrc}
              alt="Payment screenshot full size"
              className="w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
