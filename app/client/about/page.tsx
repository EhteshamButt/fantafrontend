"use client";

import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-xl">
        {/* Image-style header */}
        <div className="relative h-40 w-full">
          <Image
            src="https://dummyimage.com/1200x400/0f172a/ffa500.png&text=Fanta+Earn"
            alt="Fanta Earn banner"
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-slate-900/10" />
          <h1 className="absolute bottom-3 left-4 text-2xl font-bold text-white">
            About Us
          </h1>
        </div>

        {/* Body */}
        <div className="px-5 py-6">
          <p className="text-center text-sm text-gray-300">
            About Fanta Earn — coming soon.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/client/dashboard"
              className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
