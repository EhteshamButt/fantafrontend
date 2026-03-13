"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/20">
        <svg className="h-10 w-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-bold text-white">About Us</h2>
      <p className="mt-2 text-center text-sm text-gray-400">
        About Fanta Earn — coming soon.
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
