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
          <div className="prose prose-invert mx-auto max-w-none">
            <h2 className="mb-4 text-center text-xl font-semibold text-white">About Us</h2>
            <p className="text-justify text-gray-300">
              FANTA EARN is a e-commerce company, FANTA EARN provides a complete set of
              services for online retailers including marketing and shop templates to simplify
              the process of opening an online store for small businesses. Increase sales and
              increase product popularity.
            </p>
            <p className="mt-4 text-justify text-gray-300">
              FANTA EARN is an online marketplace created in November 2016 to level the playing
              field for online retailers and provide better e-commerce for everyone. FANTA EARN
              never holds any of its own retail inventory, and every product on the site is listed
              by an independent business, so anyone looking to sell on FANTA EARN will only be
              competing with other sellers, not the platform itself.
            </p>
            <p className="mt-4 text-justify text-gray-300">
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
