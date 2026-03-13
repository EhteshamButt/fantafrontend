"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { authApi, paymentApi } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Package {
  id: string;
  name: string;
  price: number;
  gradient: string;
}

const packages: Package[] = [
  { id: "fanta-basic", name: "Fanta Basic", price: 650, gradient: "from-orange-500 to-orange-600" },
  { id: "fanta-standard", name: "Fanta Standard", price: 1350, gradient: "from-orange-500 to-orange-600" },
  { id: "fanta-premium", name: "Fanta Premium", price: 2650, gradient: "from-orange-500 to-orange-600" },
  { id: "fanta-super-premium", name: "Fanta Super Premium", price: 5550, gradient: "from-blue-500 to-cyan-400" },
];

const EASYPAISA_NAME = "SIDRA SHAUKAT";
const EASYPAISA_NUMBER = "03184561064";

function formatPrice(price: number) {
  return price.toLocaleString("en-PK", { minimumFractionDigits: 0 });
}

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [trxId, setTrxId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        try { await authApi.refresh(); } catch { /* ignore */ }
        const data = (await authApi.profile()) as User;
        if (cancelled) return;
        if (data.role !== "user") {
          router.replace("/login");
          return;
        }
        setUser(data);
      } catch {
        if (!cancelled) router.replace("/login");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [router]);

  const handleLogout = async () => {
    try { await authApi.logout(); } finally { router.push("/login"); }
  };

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPkg(pkg);
    setTrxId("");
    setSenderNumber("");
    setScreenshot(null);
    if (fileRef.current) fileRef.current.value = "";
    // Scroll to form after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      alert("Only JPG, JPEG, PNG files are accepted.");
      e.target.value = "";
      return;
    }
    setScreenshot(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg || !trxId.trim() || !senderNumber.trim() || !screenshot) return;
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const formData = new FormData();
      formData.append("packageId", selectedPkg.id);
      formData.append("packageName", selectedPkg.name);
      formData.append("amount", String(selectedPkg.price));
      formData.append("trxId", trxId.trim());
      formData.append("senderNumber", senderNumber.trim());
      formData.append("screenshot", screenshot);

      await paymentApi.submit(formData);

      setSubmitSuccess(
        `Payment for ${selectedPkg.name} (${formatPrice(selectedPkg.price)} Rs) submitted! It will be verified shortly.`
      );
      setSelectedPkg(null);
      setTrxId("");
      setSenderNumber("");
      setScreenshot(null);
      if (fileRef.current) fileRef.current.value = "";
      // Scroll to top to see success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a1628]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-300 border-t-orange-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-[#0a1628]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-white sm:text-base">
          Welcome, <span className="text-orange-400">{user.name}</span>
        </p>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10 sm:text-sm"
        >
          Logout
        </button>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 pb-12 pt-4 sm:px-6">
        {/* Success/Error Messages */}
        {submitSuccess && (
          <div className="mb-6 w-full max-w-md rounded-lg bg-green-500/20 px-4 py-3 text-center text-sm font-medium text-green-400">
            {submitSuccess}
          </div>
        )}
        {submitError && (
          <div className="mb-6 w-full max-w-md rounded-lg bg-red-500/20 px-4 py-3 text-center text-sm font-medium text-red-400">
            {submitError}
          </div>
        )}

        {/* Package Selection */}
        <h1 className="mb-8 text-center text-xl font-bold text-white underline decoration-2 underline-offset-8 sm:mb-10 sm:text-2xl lg:text-3xl">
          Select Package
        </h1>

        <div className="flex w-full max-w-md flex-col items-center gap-5 sm:gap-6">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => handleSelectPackage(pkg)}
              className={`w-full max-w-[280px] cursor-pointer rounded-xl border-2 bg-gradient-to-r ${pkg.gradient} px-6 py-4 text-center shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 sm:max-w-xs sm:px-8 sm:py-5 ${
                selectedPkg?.id === pkg.id
                  ? "border-white ring-2 ring-white/50 scale-105"
                  : "border-green-400"
              }`}
            >
              <p className="text-base font-bold text-white underline decoration-1 underline-offset-4 sm:text-lg">
                {pkg.name}
              </p>
              <p className="mt-1 text-base font-semibold text-white sm:text-lg">
                {formatPrice(pkg.price)}.00 Rs
              </p>
            </button>
          ))}
        </div>

        {/* Payment Form — shown when a package is selected */}
        {selectedPkg && (
          <div ref={formRef} className="mt-10 w-full max-w-md sm:mt-12">
            {/* EasyPaisa Info Card */}
            <div
              className={`mx-auto w-full rounded-xl bg-gradient-to-r ${selectedPkg.gradient} px-6 py-5 text-center shadow-lg sm:px-8 sm:py-6`}
            >
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                EasyPaisa
              </h2>
              <p className="mt-2 text-sm font-bold text-orange-200 sm:text-base">
                Name: <span className="text-white">{EASYPAISA_NAME}</span>
              </p>
              <p className="mt-1 text-sm font-bold text-white sm:text-base">
                Number:{" "}
                <span className="tracking-wider">{EASYPAISA_NUMBER}</span>
              </p>
              <p className="mt-2 text-sm text-white sm:text-base">
                Amount:{" "}
                <span className="font-bold">
                  ({formatPrice(selectedPkg.price)} Rs)
                </span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:mt-8">
              {/* Trx ID */}
              <div>
                <label className="mb-1 block text-sm font-bold text-white">
                  Trxid ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  required
                  placeholder="Transaction ID"
                  className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-medium text-white placeholder-orange-200 outline-none focus:ring-2 focus:ring-white/40 sm:text-base"
                />
              </div>

              {/* Sender Number */}
              <div>
                <label className="mb-1 block text-sm font-bold text-white">
                  Sender Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  required
                  placeholder="Sender"
                  inputMode="numeric"
                  className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-medium text-white placeholder-orange-200 outline-none focus:ring-2 focus:ring-white/40 sm:text-base"
                />
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="mb-1 block text-sm font-bold text-white">
                  Upload Payment Screenshot{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  required
                  className="w-full cursor-pointer rounded-lg bg-orange-500 px-4 py-3 text-sm text-white file:mr-3 file:cursor-pointer file:rounded file:border file:border-white/40 file:bg-white/20 file:px-3 file:py-1 file:text-sm file:font-medium file:text-white sm:text-base"
                />
                <p className="mt-1 text-xs text-zinc-400">
                  Accepted formats: JPG, JPEG, PNG
                </p>
              </div>

              {/* Warning */}
              <div className="rounded-lg bg-zinc-600/60 px-4 py-3">
                <p className="text-sm italic text-yellow-400">
                  <span className="mr-1">&#9888;</span>
                  After payment, upload screenshot for verification
                </p>
              </div>

              {/* Submit */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={submitting || !trxId.trim() || !senderNumber.trim() || !screenshot}
                  className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 text-base font-extrabold text-white shadow-lg transition-all duration-200 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
                >
                  {submitting ? "Submitting..." : "Submit Payment"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
