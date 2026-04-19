"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { withdrawalApi, authApi, clearAccessToken } from "@/lib/api";

export default function WithdrawPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try { await authApi.logout(); } finally { clearAccessToken(); router.push("/login"); }
  };

  const handleStepOne = (e: React.FormEvent) => {
    e.preventDefault();
    if (!method || !amount) return;
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim() || !accountNumber.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await withdrawalApi.submit({
        method,
        amount: Number(amount),
        accountName: accountName.trim(),
        accountNumber: accountNumber.trim(),
      });
      setSuccess("Withdrawal request submitted successfully! It will be reviewed shortly.");
      setMethod("");
      setAmount("");
      setAccountName("");
      setAccountNumber("");
      setStep(1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit withdrawal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#001f3f" }}>
      {/* Logout */}
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
          className="h-36 w-full max-w-75 object-contain"
        />
      </div>

      <div className="mx-auto max-w-lg px-4">
        {/* Messages */}
        {success && (
          <div className="mb-4 rounded-lg bg-green-500/20 px-4 py-3 text-center text-base font-medium text-green-400">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/20 px-4 py-3 text-center text-base font-medium text-red-400">
            {error}
          </div>
        )}

        {/* ── Step 1: Method + Amount ── */}
        {step === 1 && (
          <form onSubmit={handleStepOne} className="space-y-6">
            <div>
              <label className="mb-2 block text-xl font-bold text-white">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                required
                className="w-full cursor-pointer appearance-none rounded-xl bg-orange-500 px-4 py-4 text-xl font-medium text-white outline-none focus:ring-2 focus:ring-white/40"
              >
                <option value="" style={{ backgroundColor: "#001f3f", color: "white" }}>Select One</option>
                <option value="easypaisa" className="bg-white text-gray-800">Easypaisa</option>
                <option value="jazzcash" className="bg-white text-gray-800">Jazzcash</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xl font-bold text-white">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min={1}
                placeholder="Enter Amount..."
                className="w-full rounded-xl bg-orange-500 px-4 py-4 text-base font-medium text-white placeholder-orange-200 outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>

            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={!method || !amount}
                className="rounded-full bg-orange-500 px-12 py-3 text-base font-extrabold text-white shadow-lg transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </form>
        )}

        {/* ── Step 2: Account Details ── */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="mb-2 text-sm leading-relaxed text-white">
              The withdrawal time of FANTA EARN is usually within 2 ~ 24 hours, and there was no service fee for withdrawal. The terms and conditions contained herein may be changed or modified at any time. Your continued participation in the program means that you accept any changes or modifications to these terms and conditions. In the event of fraud or other related behaviors, including but not limited to the above examples, FANTA EARN reserves the right to warn or freeze your account
            </p>

            <div>
              <label className="mb-2 block text-xl font-bold text-white">Account Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
                placeholder="Account"
                className="w-full rounded-xl bg-orange-500 px-4 py-4 text-base font-medium text-white placeholder-orange-200 outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-xl font-bold text-white">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                placeholder="Account"
                inputMode="numeric"
                className="w-full rounded-xl bg-orange-500 px-4 py-4 text-base font-medium text-white placeholder-orange-200 outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>

            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={submitting || !accountName.trim() || !accountNumber.trim()}
                className="rounded-full bg-orange-500 px-12 py-3 text-base font-extrabold text-white shadow-lg transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => { setStep(1); setError(""); }}
              className="w-full text-center text-sm text-gray-400 hover:text-white"
            >
              ← Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
