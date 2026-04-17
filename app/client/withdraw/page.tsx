"use client";

import { useState } from "react";
import { withdrawalApi } from "@/lib/api";

export default function WithdrawPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Step 1 → Step 2
  const handleStepOne = (e: React.FormEvent) => {
    e.preventDefault();
    if (!method || !amount) return;
    setError("");
    setStep(2);
  };

  // Step 2 → Submit to API
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
      } as Parameters<typeof withdrawalApi.submit>[0]);
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

  /* ── Step 1: Method + Amount ── */
  if (step === 1) {
    return (
      <div className="flex flex-col items-center px-2 pt-6">
        {/* Fanta Logo */}
        <img
          src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775556882/fanta_logo_1_rchhe0.png"
          alt="Fanta"
          className="mb-10"
          style={{ width: "320px", height: "150px", objectFit: "contain" }}
        />

        {success && (
          <div className="mb-4 w-full max-w-lg rounded-lg bg-green-500/20 px-4 py-3 text-center text-base font-medium text-green-400">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 w-full max-w-lg rounded-lg bg-red-500/20 px-4 py-3 text-center text-base font-medium text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleStepOne} className="w-full max-w-lg space-y-6">
          {/* Method */}
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

          {/* Amount */}
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

          {/* Next */}
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
      </div>
    );
  }

  /* ── Step 2: Account Details ── */
  return (
    <div className="flex flex-col px-4 pt-2">
      {/* Logo */}
      <div className="flex justify-center pt-6 pb-2">
        <img
          src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775556882/fanta_logo_1_rchhe0.png"
          alt="Fanta"
          className="h-36 w-full max-w-75 object-contain"
        />
      </div>

      {/* Terms paragraph */}
      <p className="mt-4 mb-6 text-sm leading-relaxed text-white">
        The withdrawal time of FANTA EARN is usually within 2 ~ 24 hours, and there was no service fee for withdrawal. The terms and conditions contained herein may be changed or modified at any time. Your continued participation in the program means that you accept any changes or modifications to these terms and conditions. In the event of fraud or other related behaviors, including but not limited to the above examples, FANTA EARN reserves the right to warn or freeze your account
      </p>

      {error && (
        <div className="mb-4 w-full rounded-lg bg-red-500/20 px-4 py-3 text-center text-base font-medium text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Name */}
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

        {/* Account Number */}
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

        {/* Submit */}
        <div className="pt-2 text-center">
          <button
            type="submit"
            disabled={submitting || !accountName.trim() || !accountNumber.trim()}
            className="rounded-full bg-orange-500 px-12 py-3 text-base font-extrabold text-white shadow-lg transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {/* Back link */}
      <button
        onClick={() => { setStep(1); setError(""); }}
        className="mt-6 text-center text-sm text-gray-400 hover:text-white"
      >
        ← Back
      </button>
    </div>
  );
}
