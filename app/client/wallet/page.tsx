"use client";

import Link from "next/link";
import { useClientUser } from "../layout";

export default function WalletPage() {
  const user = useClientUser();
  const balance = parseFloat(String(user?.walletBalance || 0));

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      {/* Balance Card */}
      <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg">
        <p className="text-sm font-medium opacity-80">Available Balance</p>
        <p className="mt-1 text-3xl font-extrabold">
          Rs {balance.toFixed(2)}
        </p>
        <p className="mt-3 text-xs opacity-70">
          Referral Code: <span className="font-bold tracking-wider">{user?.referralCode || "N/A"}</span>
        </p>
      </div>

      {/* Actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          href="/client/withdraw"
          className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-4 4m4-4l4 4" />
          </svg>
          Withdraw
        </Link>
        <Link
          href="/client/team"
          className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          My Team
        </Link>
      </div>

      {/* Info */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
          <span className="text-sm text-gray-400">Wallet Balance</span>
          <span className="text-sm font-bold text-white">Rs {balance.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
          <span className="text-sm text-gray-400">Referral Code</span>
          <span className="text-sm font-bold text-orange-400">{user?.referralCode || "N/A"}</span>
        </div>
      </div>

      <Link
        href="/client/dashboard"
        className="mt-8 block text-center text-sm font-medium text-gray-400 transition hover:text-white"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
