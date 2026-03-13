"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { useClientUser } from "../layout";

const actionCards = [
  {
    label: "Withdraw",
    href: "/client/withdraw",
    bg: "bg-orange-500",
    icon: (
      <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    label: "Team",
    href: "/client/team",
    bg: "bg-orange-500",
    icon: (
      <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Guide",
    href: "/client/guide",
    bg: "bg-orange-500",
    icon: (
      <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Official\nChannel",
    href: "/client/official-channel",
    bg: "bg-orange-500",
    icon: (
      <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    label: "Salary",
    href: "/client/salary",
    bg: "bg-orange-500",
    icon: (
      <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Work",
    href: "/client/work",
    bg: "bg-red-600",
    icon: (
      <svg className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "About Us",
    href: "/client/about",
    bg: "bg-orange-500",
    icon: (
      <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Contact Us",
    href: "/client/contact",
    bg: "bg-orange-500",
    icon: (
      <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Wallet",
    href: "/client/wallet",
    bg: "bg-orange-500",
    icon: (
      <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

export default function ClientDashboard() {
  const router = useRouter();
  const user = useClientUser();
  const [showWallet, setShowWallet] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLogout = async () => {
    try { await authApi.logout(); } finally { router.push("/login"); }
  };

  const handleCopyReferLink = async () => {
    const link = `${window.location.origin}/login?ref=${user?.id || ""}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = link;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative mx-auto max-w-lg px-4 pt-2">
      {/* Logout button top-right */}
      <div className="flex justify-end py-2">
        <button
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600"
          title="Logout"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      {/* Orange Octagon */}
      <div className="flex justify-center">
        <div
          className="flex w-72 flex-col items-center justify-center bg-orange-500 px-8 py-10 sm:w-80"
          style={{
            clipPath:
              "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
          }}
        >
          {/* Fanta logo placeholder */}
          <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-xl bg-white shadow-md">
            <span className="text-3xl font-extrabold text-orange-500">F</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
            Fanta Earn
          </h1>

          {/* Show Wallet */}
          <button
            onClick={() => setShowWallet(!showWallet)}
            className="mt-3 flex items-center gap-1.5 text-sm font-medium text-white underline underline-offset-4 transition hover:text-orange-200"
          >
            Show Wallet
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {showWallet ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              )}
            </svg>
          </button>
          {showWallet && (
            <p className="mt-1 text-lg font-bold text-white">Rs 0.00</p>
          )}

          {/* Copy Refer link */}
          <button
            onClick={handleCopyReferLink}
            className="mt-2 flex items-center gap-1.5 text-sm font-medium text-white transition hover:text-orange-200"
          >
            {copied ? "Copied!" : "Copy Refer link"}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {copied ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Notice Bar */}
      <div className="mt-6 flex items-center overflow-hidden rounded-lg bg-orange-500">
        <div className="flex h-10 w-12 shrink-0 items-center justify-center bg-blue-600">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="overflow-hidden px-4 py-2">
          <p className="animate-marquee whitespace-nowrap text-sm font-medium text-white">
            Your Notice For Dashboard &mdash; Welcome to Fanta Earn! Complete your tasks daily to maximize earnings.
          </p>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
        {actionCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`flex flex-col items-center justify-center rounded-xl ${card.bg} border-2 border-orange-600/40 px-2 py-5 shadow-md transition-transform hover:scale-105 active:scale-95 sm:py-6`}
          >
            {card.icon}
            <p className="mt-2 text-center text-xs font-bold leading-tight text-white sm:text-sm">
              {card.label.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < card.label.split("\n").length - 1 && <br />}
                </span>
              ))}
            </p>
          </Link>
        ))}
      </div>

      {/* Marquee animation style */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
