"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi, clearAccessToken } from "@/lib/api";
import { useClientUser } from "../layout";

const actionCards = [
  {
    label: "Withdraw",
    href: "/client/withdraw",
    bg: "bg-orange-500",
    icon: (
      <img src="data:image/png;base64,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" className="h-12 w-12" alt="withdraw" />
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
    href: "/client/salary-overview",
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
  {
    label: "FBR",
    href: "/client/fbr",
    bg: "bg-orange-500",
    icon: (
      <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function ClientDashboard() {
  const router = useRouter();
  const user = useClientUser();
  const [copied, setCopied] = useState(false);

  const handleLogout = async () => {
    try { await authApi.logout(); } finally { clearAccessToken(); router.push("/login"); }
  };

  const handleCopyReferLink = async () => {
    const link = `${window.location.origin}/login?ref=${user?.referralCode || user?.id || ""}`;
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
    <div className="min-h-screen w-full" style={{backgroundColor: "#001f3f"}}>
    <div className="relative mx-auto max-w-lg px-4 pt-2">
      {/* Logout button fixed top-right */}
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

      {/* Orange Octagon */}
      <div className="flex justify-center">
        <div
          className="flex w-96 flex-col items-center justify-center bg-orange-500 px-12 py-16 sm:w-105"
          style={{
            clipPath:
              "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
          }}
        >
          {/* Fanta logo */}
          <div className="mb-3 flex h-28 w-28 items-center justify-center rounded-xl bg-white shadow-md">
            <img
              src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775666576/fatbabotle_lpufpb.png"
              alt="Fanta"
              className="h-24 w-auto object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-center text-white">
            Fanta Earn
          </h1>

          {/* Show Wallet */}
          <button
            onClick={() => router.push("/client/wallet")}
            className="mt-3 flex items-center justify-center gap-2 text-lg font-medium text-white underline underline-offset-4 transition hover:text-orange-200"
          >
            Show Wallet
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4.5C7.305 4.5 3.257 7.61 1.5 12c1.757 4.39 5.805 7.5 10.5 7.5s8.743-3.11 10.5-7.5C20.743 7.61 16.695 4.5 12 4.5zm0 12.5a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
          </button>

          {/* Copy Refer link */}
          <button
            onClick={handleCopyReferLink}
            className="mt-2 flex items-center justify-center gap-2 transition hover:text-orange-200"
          >
            <p className="flex items-center justify-center gap-2 text-lg font-medium text-white">
              {copied ? "Copied!" : "Copy Refer link"}
            </p>
            <svg className="h-6 w-6 text-white font-bold cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
    </div>
  );
}
