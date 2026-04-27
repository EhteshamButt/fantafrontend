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

  // Both login and signup: orange inputs with light text
  const loginInputStyle: React.CSSProperties = {
    background: "linear-gradient(to right, #ff6c00, #ff6c00)",
    color: "#f3f4f6",
    border: "none",
    fontSize: "16px",
  };

  const signupInputStyle: React.CSSProperties = {
    background: "linear-gradient(to right, #ff6c00, #ff6c00)",
    color: "#f3f4f6",
    border: "none",
    fontSize: "16px",
  };

  // Orange button style
  const orangeBtnStyle: React.CSSProperties = {
    background: "linear-gradient(to right, #ff6c00, #ff6c00, #ff6c00, #ff6c00, #ff6c00)",
  };

  const switchForm = () => {
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
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center"
      style={{ backgroundColor: "#0b1929" }}
    >
      {/* ── Logo ── */}
      <div className="flex justify-center pt-2 pb-4 sm:pt-3 sm:pb-6">
        <div className="relative w-47.5 sm:w-62.5 md:w-75 h-36 sm:h-40 md:h-44">
          <Image
            src={isLogin
              ? "https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775556882/fanta_logo_1_rchhe0.png"
              : "https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775666576/fatbabotle_lpufpb.png"}
            alt="Fanta ADS"
            fill
            priority
          />
        </div>
      </div>

      {/* ── Form wrapper ── */}
      <div className="px-4 py-10 w-full max-w-lg mx-auto">

        <h2 className={`text-center font-bold text-white mb-8 ${isLogin ? "text-2xl" : "text-4xl"}`}>
          {isLogin ? "Login" : "Signup"}
        </h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ════════════════ LOGIN FORM ════════════════ */}
        {isLogin && (
          <form key="login" onSubmit={handleSubmit} autoComplete="on">
            <div className="mb-6">
              <label className="block mb-2 text-xl font-bold text-white">Username or email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
                autoComplete="email"
                className="login-input rounded-lg focus:ring-0 focus:border-0 border-0 block w-full p-2.5 outline-none"
                style={loginInputStyle}
                placeholder="Enter Your Username or email"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-xl font-bold text-white">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="login-input rounded-lg focus:ring-0 focus:border-0 border-0 block w-full p-2.5 outline-none"
                style={loginInputStyle}
                placeholder="Enter Your Password..."
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                onClick={switchForm}
                className="underline text-white rounded-md focus:outline-none"
              >
                SignUp?
              </button>
            </div>

            <span className="flex items-center justify-center mt-4">
              <button
                type="submit"
                disabled={loading}
                className="text-white focus:outline-none font-bold rounded-full text-xl px-5 py-2.5 text-center mb-2 disabled:cursor-not-allowed disabled:opacity-50"
                style={orangeBtnStyle}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Please wait...
                  </span>
                ) : "Login"}
              </button>
            </span>
          </form>
        )}

        {/* ════════════════ SIGNUP FORM ════════════════ */}
        {!isLogin && (
          <form key="signup" onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            <div>
              <label className="mb-2 block text-xl font-bold text-white">
                Referral Code <span className="text-gray-400 text-sm font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="referralCode"
                value={form.referralCode}
                onChange={handleChange}
                readOnly={!!refCode}
                autoComplete="off"
                className="signup-input text-gray-100 rounded-lg focus:ring-0 focus:border-0 border-0 placeholder:text-gray-100 block w-full p-2.5 outline-none"
                style={signupInputStyle}
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
              <label className="mb-2 block text-xl font-bold text-white">First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
                className="signup-input text-gray-100 rounded-lg focus:ring-0 focus:border-0 border-0 placeholder:text-gray-100 block w-full p-2.5 outline-none"
                style={signupInputStyle}
                placeholder="Enter Your First Name..."
              />
            </div>

            <div>
              <label className="mb-2 block text-xl font-bold text-white">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                autoComplete="family-name"
                className="signup-input text-gray-100 rounded-lg focus:ring-0 focus:border-0 border-0 placeholder:text-gray-100 block w-full p-2.5 outline-none"
                style={signupInputStyle}
                placeholder="Enter Your Last Name..."
              />
            </div>

            <div>
              <label className="mb-2 block text-xl font-bold text-white">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="new-email"
                className="signup-input text-gray-100 rounded-lg focus:ring-0 focus:border-0 border-0 placeholder:text-gray-100 block w-full p-2.5 outline-none"
                style={signupInputStyle}
                placeholder="Enter Your Email..."
              />
            </div>

            <div>
              <label className="mb-2 block text-xl font-bold text-white">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                className="signup-input text-gray-100 rounded-lg focus:ring-0 focus:border-0 border-0 placeholder:text-gray-100 block w-full p-2.5 outline-none"
                style={signupInputStyle}
                placeholder="Enter Your Phone Number..."
              />
            </div>

            <div>
              <label className="mb-2 block text-xl font-bold text-white">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
                className="signup-input text-gray-100 rounded-lg focus:ring-0 focus:border-0 border-0 placeholder:text-gray-100 block w-full p-2.5 outline-none"
                style={signupInputStyle}
                placeholder="Enter Your Password..."
              />
            </div>

            <div>
              <label className="mb-2 block text-xl font-bold text-white">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
                className="signup-input text-gray-100 rounded-lg focus:ring-0 focus:border-0 border-0 placeholder:text-gray-100 block w-full p-2.5 outline-none"
                style={signupInputStyle}
                placeholder="Confirm Your Password..."
              />
            </div>

            <div className="text-center pt-1">
              <p className="text-sm text-white">
                Back To Login{" "}
                <button
                  type="button"
                  onClick={switchForm}
                  className="text-orange-400 underline underline-offset-2 hover:text-orange-300 transition font-semibold"
                >
                  Here
                </button>
              </p>
            </div>

            <div className="flex justify-center pt-2 pb-8">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full px-16 py-3 font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ ...orangeBtnStyle, fontSize: "15px" }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Please wait...
                  </span>
                ) : "Sign Up"}
              </button>
            </div>
          </form>
        )}

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
