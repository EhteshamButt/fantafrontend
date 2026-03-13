"use client";

import Link from "next/link";

export default function GuidePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/20">
        <svg className="h-10 w-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-bold text-white">Guide</h2>
      <p className="mt-2 text-center text-sm text-gray-400">
        Video guides and tutorials coming soon.
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
