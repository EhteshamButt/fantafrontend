"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useClientUser } from "../layout";
import { authApi, clearAccessToken, withdrawalApi, WithdrawalRecord } from "@/lib/api";

export default function SalaryPage() {
  const user = useClientUser();
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try { await authApi.logout(); } finally { clearAccessToken(); router.push("/login"); }
  };

  useEffect(() => {
    withdrawalApi.myWithdrawals()
      .then((data) => setWithdrawals(data as WithdrawalRecord[]))
      .catch(() => setWithdrawals([]))
      .finally(() => setLoading(false));
  }, []);

  const balance = parseFloat(String(user?.walletBalance || 0));

  const approvedTotal = withdrawals
    .filter((w) => w.status === "approved")
    .reduce((sum, w) => sum + w.amount, 0);

  const pendingTotal = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.amount, 0);

  const rejectedTotal = withdrawals
    .filter((w) => w.status === "rejected")
    .reduce((sum, w) => sum + w.amount, 0);

  const stats = [
    { label: "Current Balance", value: `${balance.toFixed(0)} Rs` },
    { label: "Staff Earning", value: `${approvedTotal.toFixed(0)} Rs` },
    { label: "Fanta Earning", value: balance.toFixed(0) },
    { label: "Aproved Withdraw", value: approvedTotal.toFixed(0) },
    { label: "Pending Withdraw", value: pendingTotal.toFixed(0) },
    { label: "Rejected Withdraw", value: rejectedTotal.toFixed(0) },
  ];

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).replace(",", "");
  }

  function statusColor(status: string) {
    if (status === "approved") return "#22a85a";
    if (status === "pending") return "#f59e0b";
    return "#dc2626";
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#001f3f" }}>
      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition active:scale-95"
        style={{ background: "#ff6c00" }}
        title="Logout"
      >
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>

      {/* Logo */}
    <div className="flex justify-center pt-6 pb-2">
  <img
    src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775556882/fanta_logo_1_rchhe0.png"
    alt="Fanta"
    /* Height stays 144px (h-36), Width is now much wider (500px) */
    className="h-36 w-full max-w-[300px] object- "
  />
</div>

      {/* Wallet heading */}
      <h2 className="mb-5 text-center text-3xl font-bold text-white">Wallet</h2>

      {/* Stats Grid */}
      <div className="mx-auto grid max-w-lg grid-cols-3 gap-4 px-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center rounded-xl bg-orange-500 px-3 py-5 text-center shadow-md"
          >
            <p className="text-lg font-bold text-white">{s.value}</p>
            <p className="mt-1 text-sm font-semibold text-white leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Withdraw History */}
      <div className="mx-auto mt-8 max-w-lg px-4">
        <h3 className="mb-4 text-center text-2xl font-bold text-white">
          Withdraw<br />History
        </h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-300 border-t-orange-600" />
          </div>
        ) : withdrawals.length === 0 ? (
          <p className="text-center text-gray-400">No withdrawal history yet.</p>
        ) : (
          <div className="space-y-0">
            {withdrawals.map((w) => (
              <div key={w.id} className="border-b border-white/20 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">{w.amount.toFixed(2)}</p>
                    <span
                      className="mt-1 inline-block rounded-full px-4 py-1 text-base font-bold text-white capitalize"
                      style={{ backgroundColor: statusColor(w.status) }}
                    >
                      {w.status === "approved" ? "Success" : w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-base font-bold text-white">{formatDate(w.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
