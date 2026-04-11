"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { authApi, setAccessToken } from "@/lib/api";
import Image from "next/image";

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

  const inputStyle: React.CSSProperties = {
    backgroundColor: "#dce3ef",
    color: "#111827",
    border: "none",
    fontSize: "16px", // prevents iOS auto-zoom on focus
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center"
      style={{ backgroundColor: "#0b1929" }}
    >
<div className="flex justify-center pt-2 pb-4 sm:pt-3 sm:pb-6">
  {/* I increased the width to 500px (w-[500px]) but kept your exact height */}
  <div className="relative w-[190px] sm:w-[250px] md:w-[300px] h-36 sm:h-40 md:h-44">
    <Image
      src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775556882/fanta_logo_1_rchhe0.png"
      alt="Fanta ADS"
      fill
      // style={{ objectFit: 'contain' }}
      priority
    />
  </div>
</div>

      {/* ── Form wrapper ── */}
      <div className="w-full px-5 sm:px-0 sm:max-w-sm md:max-w-md">

        <h1 className="mb-5 text-center text-2xl font-bold text-white tracking-wide">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── Signup-only fields ── */}
          {!isLogin && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-white">Referral Code</label>
                <input
                  type="text"
                  name="referralCode"
                  value={form.referralCode}
                  onChange={handleChange}
                  readOnly={!!refCode}
                  className="w-full rounded-lg py-3 px-4 outline-none transition"
                  style={inputStyle}
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

              <div>
                <label className="mb-1.5 block text-sm font-bold text-white">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg py-3 px-4 outline-none transition"
                  style={inputStyle}
                  placeholder="Enter Your First Name..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-white">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg py-3 px-4 outline-none transition"
                  style={inputStyle}
                  placeholder="Enter Your Last Name..."
                />
              </div>
            </>
          )}

          {/* ── Email ── */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-white">
              {isLogin ? "Username or email" : "Email"}
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg py-3 px-4 outline-none transition"
              style={inputStyle}
              placeholder="Enter your email..."
            />
          </div>

          {/* ── Phone (signup only) ── */}
          {!isLogin && (
            <div>
              <label className="mb-1.5 block text-sm font-bold text-white">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg py-3 px-4 outline-none transition"
                style={inputStyle}
                placeholder="Enter Your Phone Number..."
              />
            </div>
          )}

          {/* ── Password ── */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-white">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full rounded-lg py-3 px-4 outline-none transition"
              style={inputStyle}
              placeholder="Enter your password..."
            />
          </div>

          {/* ── Confirm Password (signup only) ── */}
          {!isLogin && (
            <div>
              <label className="mb-1.5 block text-sm font-bold text-white">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full rounded-lg py-3 px-4 outline-none transition"
                style={inputStyle}
                placeholder="Confirm Your Password..."
              />
            </div>
          )}

          {/* ── Toggle SignUp / Login ── */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setForm({
                  email: "",
                  password: "",
                  confirmPassword: "",
                  firstName: "",
                  lastName: "",
                  phone: "",
                  referralCode: refCode,
                });
              }}
              className="text-sm text-gray-300 underline underline-offset-2 hover:text-white transition"
            >
              {isLogin ? "SignUp?" : "Login?"}
            </button>
          </div>

          {/* ── Submit Button ── */}
          <div className="flex justify-center pt-2 pb-8">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full px-16 py-3 font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: "#f97316", fontSize: "15px" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Please wait...
                </span>
              ) : isLogin ? "Login" : "Sign Up"}
            </button>
          </div>

        </form>
      </div>
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
