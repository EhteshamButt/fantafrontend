"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi, PaymentRecord } from "@/lib/api";

export default function PaymentEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [phone, setPhone] = useState("");
  const [gatewayName, setGatewayName] = useState("");
  const [trxId, setTrxId] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const applyPayment = (p: PaymentRecord) => {
    setPayment(p);
    setGatewayName(p.packageName || "");
    setTrxId(p.trxId || "");
    setAmount(p.amount?.toString() || "");
    setSelectedPlan(p.packageId || "");
    if (p.userId) {
      adminApi
        .getUserDetail(p.userId)
        .then(({ user }) => setPhone(user.phone || ""))
        .catch(() => {});
    }
  };

  useEffect(() => {
    // 1. Try sessionStorage
    const cached = sessionStorage.getItem(`payment_${id}`);
    if (cached) {
      try {
        applyPayment(JSON.parse(cached));
        return;
      } catch { /* fall through */ }
    }

    // 2. Fallback: fetch pending list and find by ID
    adminApi
      .getPendingPayments()
      .then((list) => {
        const found = list.find((p) => p.id === id);
        if (found) {
          sessionStorage.setItem(`payment_${id}`, JSON.stringify(found));
          applyPayment(found);
        } else {
          // 3. Try all payments (page 1, large limit)
          return adminApi.getAllPayments(1, 200).then(({ payments }) => {
            const p = payments.find((x) => x.id === id);
            if (p) {
              sessionStorage.setItem(`payment_${id}`, JSON.stringify(p));
              applyPayment(p);
            }
          });
        }
      })
      .catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = async () => {
    if (!payment) return;
    setSaving(true);
    setSaveMsg("");
    try {
      await adminApi.updatePaymentStatus(payment.id, payment.status);
      // Update sessionStorage with latest data
      const updated = { ...payment, packageName: gatewayName, trxId, amount: parseFloat(amount) };
      sessionStorage.setItem(`payment_${id}`, JSON.stringify(updated));
      setSaveMsg("Updated successfully!");
      setTimeout(() => router.back(), 1000);
    } catch {
      setSaveMsg("Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  if (!payment) {
    return (
      <div className="rounded-xl bg-orange-50 p-8 text-center">
        <p className="text-base font-semibold text-orange-600">Payment data not available</p>
        <button
          onClick={() => router.push("/admin/new-requests")}
          className="mt-4 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Go to Pending Deposits
        </button>
      </div>
    );
  }

  const username =
    (payment.user as (PaymentRecord["user"] & { referralCode?: string }) | undefined)?.referralCode ||
    payment.user?.name?.toLowerCase().replace(/\s+/g, "") ||
    "unknown";

  const inputCls = "w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-1 focus:ring-indigo-400 transition-colors";
  const readonlyCls = "w-full rounded-xl border border-gray-100 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none cursor-default";
  const labelCls = "mb-1.5 block text-sm font-medium text-gray-600";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          <span className="text-indigo-600">@{username}</span> requested{" "}
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

      {/* Form */}
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-6">
        {/* Row 1: Username, Fullname, Mobile */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Username</label>
            <input readOnly value={username} className={readonlyCls} />
          </div>
          <div>
            <label className={labelCls}>Fullname</label>
            <input readOnly value={payment.user?.name || ""} className={readonlyCls} />
          </div>
          <div>
            <label className={labelCls}>Mobile</label>
            <input readOnly value={phone} className={readonlyCls} />
          </div>
        </div>

        {/* Row 2: Gateway Name, Transaction Number, Status */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Gateway Name</label>
            <input
              value={gatewayName}
              onChange={(e) => setGatewayName(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Transaction Number</label>
            <input
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <input readOnly value={payment.status.charAt(0).toUpperCase() + payment.status.slice(1)} className={readonlyCls} />
          </div>
        </div>

        {/* Row 3: Amount */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Amount (Rs)</label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        {/* Row 4: Select Plan */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>
              Select Plan <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className={inputCls}
            >
              <option value="">Select Plan</option>
              <option value={payment.packageId}>{payment.packageName}</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {saving ? "Updating..." : "Update Plan"}
          </button>
        </div>
        {saveMsg && (
          <p className={`text-center text-sm font-medium ${saveMsg.includes("success") ? "text-green-600" : "text-red-500"}`}>
            {saveMsg}
          </p>
        )}
      </div>
    </div>
  );
}
