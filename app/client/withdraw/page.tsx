"use client";

import { useState } from "react";
import { withdrawalApi } from "@/lib/api";

export default function WithdrawPage() {
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!method || !amount) return;
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await withdrawalApi.submit({ method, amount: Number(amount) });
      setSuccess("Withdrawal request submitted successfully! It will be reviewed shortly.");
      setMethod("");
      setAmount("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit withdrawal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 pt-6">
      {/* Fanta ADS Logo */}
      <div className="mb-8 flex h-28 w-36 items-center justify-center rounded-[50%] bg-orange-500 shadow-lg">
        <span className="text-center text-2xl font-extrabold leading-tight text-white">
          Fanta<br />
          <span className="text-3xl">ADS</span>
        </span>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-4 w-full max-w-md rounded-lg bg-green-500/20 px-4 py-3 text-center text-sm font-medium text-green-400">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 w-full max-w-md rounded-lg bg-red-500/20 px-4 py-3 text-center text-sm font-medium text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        {/* Method */}
        <div>
          <label className="mb-2 block text-sm font-bold text-white">
            Method
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            required
            className="w-full cursor-pointer appearance-none rounded-lg bg-orange-500 px-4 py-3.5 text-base font-medium text-white outline-none focus:ring-2 focus:ring-white/40"
          >
            <option value="" className="bg-white text-gray-800">Select One</option>
            <option value="easypaisa" className="bg-white text-gray-800">Easypaisa</option>
            <option value="jazzcash" className="bg-white text-gray-800">Jazzcash</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="mb-2 block text-sm font-bold text-white">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min={1}
            placeholder="Enter Amount..."
            className="w-full rounded-lg bg-orange-500 px-4 py-3.5 text-base font-medium text-white placeholder-orange-200 outline-none focus:ring-2 focus:ring-white/40"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 text-center">
          <button
            type="submit"
            disabled={submitting || !method || !amount}
            className="rounded-full bg-orange-500 px-10 py-3 text-base font-extrabold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
