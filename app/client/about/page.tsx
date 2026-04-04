"use client";

import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-xl">
        {/* Header with brand logo and title */}
        <div className="flex flex-col items-center px-6 pt-6">
          <Image
            src="https://fantaearn.com/assets/images/logoIcon/fanta_logo.png"
            alt="Fanta Earn Logo"
            width={220}
            height={120}
            priority
            className="h-auto w-[180px] sm:w-[220px] object-contain"
          />
          <h1 className="mt-4 inline-block rounded-md bg-blue-800 px-4 py-1.5 text-2xl font-extrabold leading-none text-white">
            About Us
          </h1>
        </div>

        {/* Body */}
        <div className="px-5 pb-6 pt-4">
          <div className="mx-auto max-w-xl space-y-5 text-center">
            <p className="mx-auto inline-block rounded bg-blue-900/30 px-3 py-2 text-sm leading-7 text-gray-200">
              FANTA EARN is a e-commerce company, FANTA EARN provides a complete set of
              services for online retailers including marketing and shop templates to simplify
              the process of opening an online store for small businesses. Increase sales and
              increase product popularity.
            </p>
            <p className="mx-auto inline-block rounded bg-blue-900/30 px-3 py-2 text-sm leading-7 text-gray-200">
              FANTA EARN is an online marketplace created in November 2016 to level the playing
              field for online retailers and provide better e-commerce for everyone. FANTA EARN
              never holds any of its own retail inventory, and every product on the site is listed
              by an independent business, so anyone looking to sell on FANTA EARN will only be
              competing with other sellers, not the platform itself.
            </p>
            <p className="mx-auto inline-block rounded bg-blue-900/30 px-3 py-2 text-sm leading-7 text-gray-200">
              If you want to know more, please feel free to contact us. You can learn about and
              contact us through the following channels.
            </p>
          </div>
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
