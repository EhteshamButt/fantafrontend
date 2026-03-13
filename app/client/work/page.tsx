"use client";

import Link from "next/link";

export default function WorkPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
        <svg className="h-10 w-10 text-red-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-bold text-white">Work</h2>
      <p className="mt-2 text-center text-sm text-gray-400">
        Facebook work tasks coming soon.
      </p>
      <Link
        href="/client/dashboard"
        className="mt-6 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
