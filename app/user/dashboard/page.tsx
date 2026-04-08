'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
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

  const handleLogout = () => {
    // 1. Remove the token
    localStorage.removeItem("access_token");
    
    // 2. Redirect to the login page
    // Note: In Next.js, use router.push() for internal navigation
    router.push('/login');
  };
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [trxId, setTrxId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successPackage, setSuccessPackage] = useState<Package | null>(null);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer effect
  useEffect(() => {
    if (!paymentSuccess) return;

    // Initialize with 24 hours for approval
    setHours(24);
    setMinutes(0);
    setSeconds(0);

    countdownRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev > 0) return prev - 1;
        setMinutes((prevMin) => {
          if (prevMin > 0) return prevMin - 1;
          setHours((prevHours) => {
            if (prevHours > 0) return prevHours - 1;
            // Timer finished
            clearInterval(countdownRef.current!);
            return 0;
          });
          return 59;
        });
        return 59;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [paymentSuccess]);

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPkg(pkg);
    setTrxId("");
    setSenderNumber("");
    setScreenshot(null);
    if (fileRef.current) fileRef.current.value = "";
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

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success screen
      setPaymentSuccess(true);
      setSuccessPackage(selectedPkg);
      setSelectedPkg(null);
      setTrxId("");
      setSenderNumber("");
      setScreenshot(null);
      if (fileRef.current) fileRef.current.value = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToDashboard = () => {
    setPaymentSuccess(false);
    setSuccessPackage(null);
  };

  // Success Screen
  if (paymentSuccess) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0a1628] to-[#1a2d4d]">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-white sm:text-base">
            FantaEarn Payment Portal
          </p>
          <button
            onClick={handleBackToDashboard}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10 sm:text-sm"
          >
            Close
          </button>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
          {/* Fanta Logo Circle */}
          <div className="relative mb-8 h-40 w-40 sm:h-48 sm:w-48">
  <img
    src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775556882/fanta_logo_1_rchhe0.png"
    alt="Fanta Logo"
    className="h-full w-full object-contain"
  />
</div>

          {/* Success Message */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black text-red-600 sm:text-4xl lg:text-5xl">
              Trx Id Updated
            </h1>
            <h2 className="text-3xl font-black text-red-600 sm:text-4xl lg:text-5xl">
              Successfully!
            </h2>
          </div>

          {/* Info Text */}
          <p className="mb-8 max-w-md text-center text-base font-semibold text-white sm:text-lg">
            We are reviewing your information. If your information will correct than your account will approved. Otherwise you will be reject!
          </p>

          {/* Countdown Card */}
          <div className="mb-8 w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-2xl sm:px-8">
            <h3 className="mb-6 text-center text-xl font-semibold text-gray-800 sm:text-2xl">
              Deposit Aprove Time
            </h3>

            <div className="mb-6 flex items-center justify-center gap-4">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="text-3xl font-black text-gray-800 sm:text-4xl">
                  {String(hours).padStart(2, "0")}
                </div>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="text-3xl font-black text-gray-800 sm:text-4xl">
                  {String(minutes).padStart(2, "0")}
                </div>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="text-3xl font-black text-gray-800 sm:text-4xl">
                  {String(seconds).padStart(2, "0")}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-center text-sm font-medium text-gray-600 sm:text-base">
              <span>Hours</span>
              <span>Minutes</span>
              <span>Seconds</span>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={handleBackToDashboard}
            className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 text-base font-bold text-white shadow-lg transition-all duration-200 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl sm:text-lg"
          >
            Back to Dashboard
          </button>

          {/* Package Info */}
          {successPackage && (
            <div className="mt-8 text-center text-sm text-gray-300">
              <p>Package: <span className="font-semibold text-orange-400">{successPackage.name}</span></p>
              <p>Amount: <span className="font-semibold text-orange-400">{formatPrice(successPackage.price)} Rs</span></p>
            </div>
          )}
        </main>

        {/* Navigation Bar */}
        <div className="flex items-center justify-around bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-4 text-white">
          <div className="flex h-8 w-8 items-center justify-center">🏠</div>
          <div className="flex h-8 w-8 items-center justify-center">🔔</div>
          <div className="flex h-8 w-8 items-center justify-center">💰</div>
          <div className="flex h-8 w-8 items-center justify-center">🎧</div>
          <div className="flex h-8 w-8 items-center justify-center">👤</div>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="flex min-h-screen flex-col bg-[#0a1628]">
      {/* Header */}
      {/* <header className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-white sm:text-base">
          Welcome to <span className="text-orange-400">FantaEarn</span>
        </p>
      </header> */}
      {/* Header with Logo */}
      <header className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      {/* Left side */}
      <p className="text-sm font-medium text-white sm:text-base">
        Welcome to <span className="text-orange-400">FantaEarn</span>
      </p>

      {/* Right side - Logout Icon */}
      <button 
        onClick={handleLogout}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 transition-transform active:scale-95 hover:bg-orange-600 focus:outline-none"
        aria-label="Logout"
      >
        <svg 
          className="h-6 w-6 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
          />
        </svg>
      </button>
    </header>

      <main className="flex flex-1 flex-col items-center px-4 pb-12 pt-4 sm:px-6">
        {/* Error Message */}
        {submitError && (
          <div className="mb-6 w-full max-w-md rounded-lg bg-red-500/20 px-4 py-3 text-center text-sm font-medium text-red-400">
            {submitError}
          </div>
        )}
<h1 className="flex flex-col items-center justify-center pt-16 pb-6">  <img
    src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775666576/fatbabotle_lpufpb.png"
    alt="Fanta Logo"
    className="h-24 sm:h-28 lg:h-36 w-auto object-contain"
  />
</h1>

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

        {/* Payment Form */}
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