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
    <div className="flex flex-col items-center px-2 pt-6">
      {/* Fanta Logo */}
      <img
        src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775556882/fanta_logo_1_rchhe0.png"
        alt="Fanta"
        className="mb-10 object- "
        style={{ width: "320px", height: "150px" }}
      />

      {/* Messages */}
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
        {/* Method */}
        <div>
          <label className="mb-2 block text-xl font-bold text-white">
            Method
          </label>
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
          <label className="mb-2 block text-xl font-bold text-white">
            Amount
          </label>
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

        {/* Submit */}
        <div className="pt-2 text-center">
          <button
            type="submit"
            disabled={submitting || !method || !amount}
            className="rounded-full bg-orange-500 px-12 py-3 text-base font-extrabold text-white shadow-lg transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
