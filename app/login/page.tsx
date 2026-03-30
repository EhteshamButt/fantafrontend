"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { authApi, setAccessToken } from "@/lib/api";

interface AuthResult {
  user: { id: string; email: string; name: string; role: string };
  accessToken: string;
}

function redirectByRole(role: string): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "client":
      return "/client/dashboard";
    default:
      return "/user/dashboard";
  }
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") || "";
  const [isLogin, setIsLogin] = useState(!refCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    referralCode: refCode,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isLogin && form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      let result: AuthResult;
      if (isLogin) {
        result = (await authApi.login(form.email, form.password)) as AuthResult;
      } else {
        const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
        result = (await authApi.register({
          email: form.email,
          password: form.password,
          name: fullName,
          ...(form.phone ? { phone: form.phone } : {}),
          ...(form.referralCode ? { referralCode: form.referralCode } : {}),
        })) as AuthResult;
      }
      setAccessToken(result.accessToken);
      router.push(redirectByRole(result.user.role));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(180deg, #0a0e27 0%, #111638 50%, #0a0e27 100%)" }}
    >
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <div
          className="flex h-20 w-20 items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
          }}
        >
          <span className="text-2xl font-black text-white">F</span>
        </div>
        <h2 className="mt-3 text-xl font-bold text-white tracking-wide">Fanta ADS</h2>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <h1 className="mb-1 text-center text-2xl font-bold text-white">
          {isLogin ? "Log In" : "Sign Up"}
        </h1>
        <p className="mb-6 text-center text-sm text-gray-400">
          {isLogin ? "Welcome back! Please sign in." : "Create your account to get started."}
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Referral Code - only on signup */}
          {!isLogin && (
            <div>
              <label className="mb-1.5 block text-sm font-bold text-white">Referral Code</label>
              <input
                type="text"
                name="referralCode"
                value={form.referralCode}
                onChange={handleChange}
                readOnly={!!refCode}
                className={`w-full rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition ${
                  refCode
                    ? "border-2 border-orange-500 bg-orange-500/20 font-semibold tracking-widest"
                    : "border border-white/10 bg-white/5 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
                }`}
                style={refCode ? { background: "linear-gradient(135deg, #f97316, #ea580c)" } : {}}
                placeholder="Enter Referral Code (Optional)"
              />
              {refCode && (
                <p className="mt-1 flex items-center gap-1 text-xs text-green-400">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Referral code automatically applied
                </p>
              )}
            </div>
          )}

          {/* First Name - only on signup */}
          {!isLogin && (
            <div>
              <label className="mb-1.5 block text-sm font-bold text-white">First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required={!isLogin}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
                style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
                placeholder="Enter Your First Name..."
              />
            </div>
          )}

          {/* Last Name - only on signup */}
          {!isLogin && (
            <div>
              <label className="mb-1.5 block text-sm font-bold text-white">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required={!isLogin}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
                style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
                placeholder="Enter Your Last Name..."
              />
            </div>
          )}

          {/* Email */}
          <div>
            {!isLogin && <label className="mb-1.5 block text-sm font-bold text-white">Email</label>}
            <div className="relative">
              {isLogin && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className={`w-full rounded-xl py-3 text-sm text-white placeholder-gray-500 outline-none transition ${
                  isLogin
                    ? "border border-white/10 bg-white/5 pl-10 pr-4 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
                    : "border border-white/10 px-4 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
                }`}
                style={!isLogin ? { background: "linear-gradient(135deg, #f97316, #ea580c)" } : {}}
                placeholder={isLogin ? "Email Address" : "Enter Your Email..."}
              />
            </div>
          </div>

          {/* Phone Number - only on signup */}
          {!isLogin && (
            <div>
              <label className="mb-1.5 block text-sm font-bold text-white">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
                style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
                placeholder="Enter Your Phone Number..."
              />
            </div>
          )}

          {/* Password */}
          <div>
            {!isLogin && <label className="mb-1.5 block text-sm font-bold text-white">Password</label>}
            <div className="relative">
              {isLogin && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              )}
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                className={`w-full rounded-xl py-3 text-sm text-white placeholder-gray-500 outline-none transition ${
                  isLogin
                    ? "border border-white/10 bg-white/5 pl-10 pr-4 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
                    : "border border-white/10 px-4 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
                }`}
                style={!isLogin ? { background: "linear-gradient(135deg, #f97316, #ea580c)" } : {}}
                placeholder={isLogin ? "Password" : "Enter Your Password..."}
              />
            </div>
          </div>

          {/* Confirm Password - only on signup */}
          {!isLogin && (
            <div>
              <label className="mb-1.5 block text-sm font-bold text-white">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
                minLength={8}
                className="w-full rounded-xl border border-white/10 py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
                style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
                placeholder="Confirm Your Password..."
              />
            </div>
          )}

          {isLogin && (
            <div className="text-right">
              <button type="button" className="text-xs text-orange-400 hover:text-orange-300 transition">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Please wait...
              </span>
            ) : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setForm({ email: "", password: "", confirmPassword: "", firstName: "", lastName: "", phone: "", referralCode: refCode });
            }}
            className="font-semibold text-orange-400 hover:text-orange-300 transition"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-gray-600">
        &copy; 2026 Fanta ADS. All rights reserved.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
