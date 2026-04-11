"use client";

import { useRouter } from "next/navigation";
import { authApi, clearAccessToken } from "@/lib/api";

export default function SalaryOverviewPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try { await authApi.logout(); } finally { clearAccessToken(); router.push("/login"); }
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#001f3f" }}>
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

      {/* Logo */}
      <div className="flex justify-center pt-6 pb-2">
  <img
    src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775556882/fanta_logo_1_rchhe0.png"
    alt="Fanta"
    /* Height stays 144px (h-36), Width is now much wider (500px) */
    className="h-36 w-full max-w-[300px] object- "
  />
</div>

      {/* Content */}
      <div className="px-4 pt-10 mb-10 max-w-lg mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-8">FantaEarn Salary</h2>
        <p className="text-white font-medium text-lg text-center">
          Salary is an extra Income which will you get after Achieving level 10. Your Salary is according to Your package. &quot;BASIC&quot; Daily salary is Rs 1000 and Monthly Rs 30000 &quot;STANDARD&quot; Daily salary is Rs 1500 and Monthly Rs 45000 &quot;PREMIUM&quot; Daily salary is Rs 2500 and Monthly Rs 75000 &quot;SUPER PREMIUM&quot; Daily salary is R&apos;s 3700 And Monthly Rs 111000.
        </p>
      </div>
    </div>
  );
}
