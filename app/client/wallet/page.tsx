"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { withdrawalApi, authApi, clearAccessToken } from "@/lib/api";
import { useClientUser } from "../layout";

interface WithdrawalRecord {
  id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  method: string;
}

export default function WalletPage() {
  const user = useClientUser();
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const balance = parseFloat(String(user?.walletBalance || 0));
  const staffEarning = parseFloat(String((user as unknown as Record<string, unknown>)?.staffEarning || 0));
  const fantaEarning = parseFloat(String((user as unknown as Record<string, unknown>)?.fantaEarning || 0));

  useEffect(() => {
    withdrawalApi
      .myWithdrawals()
      .then((data) => setWithdrawals(data as WithdrawalRecord[]))
      .catch(() => setWithdrawals([]))
      .finally(() => setLoading(false));
  }, []);

  const approved = withdrawals
    .filter((w) => w.status === "approved")
    .reduce((s, w) => s + parseFloat(String(w.amount)), 0);

  const pending = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((s, w) => s + parseFloat(String(w.amount)), 0);

  const rejected = withdrawals
    .filter((w) => w.status === "rejected")
    .reduce((s, w) => s + parseFloat(String(w.amount)), 0);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAccessToken();
      router.push("/login");
    }
  };

  const statCards = [
    { label: "Current Balance", value: `${balance.toFixed(2)} Rs` },
    { label: "Staff Earning", value: `${staffEarning.toFixed(0)} Rs` },
    { label: "Fanta Earning", value: fantaEarning.toFixed(0) },
    { label: "Aproved Withdraw", value: approved.toFixed(0) },
    { label: "Pending Withdraw", value: pending.toFixed(0) },
    { label: "Rejected Withdraw", value: rejected.toFixed(0) },
  ];

  const statusBadge: Record<string, { label: string; bg: string }> = {
    approved: { label: "Success", bg: "bg-green-500" },
    pending: { label: "Pending", bg: "bg-yellow-500" },
    rejected: { label: "Rejected", bg: "bg-red-500" },
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#001f3f" }}>
      {/* Logout */}
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

      <div className="mx-auto max-w-lg px-4 pt-4 pb-24">
        {/* Logo */}
        <a href="/client/dashboard" className="flex h-40 items-center justify-center">
          <img
            src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775556882/fanta_logo_1_rchhe0.png"
            alt="Fanta"
            style={{ width: "280px", height: "140px", objectFit: "contain" }}
          />
        </a>

        {/* Title */}
        <h2 className="mb-4 text-center text-2xl font-bold text-white">Wallet</h2>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-3 gap-3">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="flex flex-col items-center justify-center rounded-2xl px-2 py-5 text-center text-white"
              style={{ backgroundColor: "#ff6c00" }}
            >
              <p className="text-lg font-extrabold leading-tight">{card.value}</p>
              <p className="mt-1 text-xs font-semibold leading-snug opacity-90">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Withdraw History */}
        <h2 className="mb-4 mt-8 text-center text-2xl font-bold text-white">
          Withdraw History
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-300 border-t-orange-600" />
          </div>
        ) : withdrawals.length === 0 ? (
          <p className="py-8 text-center text-gray-400">No withdrawal history found.</p>
        ) : (
          <div className="space-y-0 divide-y divide-white/10">
            {withdrawals.map((w) => {
              const badge = statusBadge[w.status] ?? { label: w.status, bg: "bg-gray-500" };
              const dateStr = new Date(w.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });
              return (
                <div key={w.id} className="flex items-center justify-between py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-bold text-white">
                      {parseFloat(String(w.amount)).toFixed(2)}
                    </span>
                    <span
                      className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold text-white ${badge.bg}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <span className="text-sm text-gray-300">{dateStr}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
