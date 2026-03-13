"use client";

import Link from "next/link";

export default function WalletPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/20">
        <svg className="h-10 w-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-bold text-white">Wallet</h2>
      <p className="mt-2 text-center text-sm text-gray-400">
        Your wallet details and transactions coming soon.
      </p>
      <Link
        href="/client/dashboard"
        className="mt-6 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
