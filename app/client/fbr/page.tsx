"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { authApi, clearAccessToken } from "@/lib/api";

export default function FbrPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try { await authApi.logout(); } finally { clearAccessToken(); router.push("/login"); }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white">
      {/* Logout button */}
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

      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">FBR Certificate</h1>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
          <div className="relative w-full" style={{ paddingTop: "141%" }}>
            <Image
              src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775295707/fbr_mdknyt.jpg"
              alt="FBR Taxpayer Registration Certificate"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-contain bg-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
