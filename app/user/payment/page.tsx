"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";
import { Suspense } from "react";

const packageNames: Record<string, string> = {
  "fanta-basic": "Fanta Basic",
  "fanta-standard": "Fanta Standard",
  "fanta-premium": "Fanta Premium",
  "fanta-super-premium": "Fanta Super Premium",
};

function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("package") || "";
  const price = searchParams.get("price") || "0";
  const packageName = packageNames[packageId] || packageId;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        try { await authApi.refresh(); } catch { /* ignore */ }
        const data = (await authApi.profile()) as { role: string };
        if (cancelled) return;
        if (data.role !== "user") {
          router.replace("/login");
          return;
        }
      } catch {
        if (!cancelled) router.replace("/login");
        return;
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    check();
    return () => { cancelled = true; };
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const digits = value.replace(/\D/g, "").slice(0, 16);
      const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
      setForm((f) => ({ ...f, cardNumber: formatted }));
      return;
    }

    if (name === "expiry") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      const formatted = digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
      setForm((f) => ({ ...f, expiry: formatted }));
      return;
    }

    if (name === "cvv") {
      setForm((f) => ({ ...f, cvv: value.replace(/\D/g, "").slice(0, 4) }));
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Placeholder — no real payment API yet
    setTimeout(() => {
      alert(`Payment of Rs ${Number(price).toLocaleString("en-PK", { minimumFractionDigits: 2 })} for ${packageName} submitted successfully!`);
      setSubmitting(false);
      router.push("/user/dashboard");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a1628]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-300 border-t-orange-600" />
      </div>
    );
  }

  if (!packageId || !price) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a1628] px-4 text-center">
        <p className="mb-4 text-lg text-white">No package selected.</p>
        <button
          onClick={() => router.push("/user/dashboard")}
          className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          Back to Packages
        </button>
      </div>
    );
  }

  const isBlue = packageId === "fanta-super-premium";

  return (
    <div className="flex min-h-screen flex-col bg-[#0a1628]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push("/user/dashboard")}
          className="text-sm font-medium text-white/80 transition hover:text-white"
        >
          &larr; Back to Packages
        </button>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 pb-12 sm:px-6">
        {/* Selected Package Badge */}
        <div
          className={`mb-6 w-full max-w-sm rounded-xl border-2 border-green-400 bg-gradient-to-r ${isBlue ? "from-blue-500 to-cyan-400" : "from-orange-500 to-orange-600"} px-6 py-4 text-center shadow-lg sm:mb-8`}
        >
          <p className="text-lg font-bold text-white sm:text-xl">{packageName}</p>
          <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            {Number(price).toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs
          </p>
        </div>

        {/* Payment Form */}
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
          <h2 className="mb-6 text-center text-lg font-bold text-white sm:text-xl">
            Payment Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-white/70">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardName"
                value={form.cardName}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-white/70">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleChange}
                required
                placeholder="1234 5678 9012 3456"
                inputMode="numeric"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm tracking-widest text-white placeholder-white/40 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">
                  Expiry
                </label>
                <input
                  type="text"
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                  required
                  placeholder="MM/YY"
                  inputMode="numeric"
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                  required
                  placeholder="123"
                  inputMode="numeric"
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Processing..." : `Pay ${Number(price).toLocaleString("en-PK", { minimumFractionDigits: 2 })} Rs`}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a1628]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-300 border-t-orange-600" />
        </div>
      }
    >
      <PaymentForm />
    </Suspense>
  );
}
