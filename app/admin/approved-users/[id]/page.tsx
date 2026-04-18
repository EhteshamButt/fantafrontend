"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";

interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  walletBalance: number;
  level: number;
  dailyLimit: number;
  referralCode: string | null;
  referredBy: string | null;
  isBanned: boolean;
  banReason: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  balance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalTransactions: number;
  teamCount: number;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [level, setLevel] = useState(0);
  const [referralCode, setReferralCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [balanceModal, setBalanceModal] = useState<"add" | "subtract" | null>(null);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceRemark, setBalanceRemark] = useState("");
  const [balanceSaving, setBalanceSaving] = useState(false);

  const [banModal, setBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banSaving, setBanSaving] = useState(false);

  useEffect(() => {
    adminApi
      .getUserDetail(id)
      .then(({ user: u, stats: s }) => {
        setUser(u as UserDetail);
        setStats(s);
        const parts = u.name.split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
        setEmail(u.email);
        setPhone((u.phone || "").replace(/^\+92/, ""));
        setLevel(u.level);
        setReferralCode(u.referralCode || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      await adminApi.updateUserDetail(id, {
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone: phone ? `+92${phone}` : undefined,
        level,
        referralCode,
      });
      setSaveMsg("Saved successfully!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setSaveMsg("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleBalanceSubmit = async () => {
    if (!balanceModal || !balanceAmount) return;
    setBalanceSaving(true);
    try {
      const result = await adminApi.adjustBalance(id, parseFloat(balanceAmount), balanceModal) as { balance: number };
      setStats((prev) => prev ? { ...prev, balance: result.balance } : prev);
      setUser((prev) => prev ? { ...prev, walletBalance: result.balance } : prev);
      setBalanceModal(null);
      setBalanceAmount("");
      setBalanceRemark("");
    } catch {
      alert("Failed to adjust balance.");
    } finally {
      setBalanceSaving(false);
    }
  };

  const handleBanSubmit = async () => {
    if (!banReason.trim()) return;
    setBanSaving(true);
    try {
      await adminApi.banUser(id, banReason);
      setUser((prev) => prev ? { ...prev, isBanned: true, banReason } : prev);
      setBanModal(false);
      setBanReason("");
    } catch {
      alert("Failed to ban user.");
    } finally {
      setBanSaving(false);
    }
  };

  const handleUnban = async () => {
    try {
      await adminApi.unbanUser(id);
      setUser((prev) => prev ? { ...prev, isBanned: false, banReason: null } : prev);
    } catch {
      alert("Failed to unban user.");
    }
  };

  const handleLoginAsUser = async () => {
    try {
      const { accessToken } = await adminApi.impersonateUser(id);
      // Save admin token so we can restore it later
      const adminToken = localStorage.getItem("access_token");
      if (adminToken) localStorage.setItem("admin_token", adminToken);
      localStorage.setItem("access_token", accessToken);
      router.push("/user/dashboard");
    } catch {
      alert("Failed to login as user.");
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-gray-200" />)}
      </div>
    );
  }

  if (!user || !stats) {
    return (
      <div className="rounded-xl bg-red-50 p-8 text-center">
        <p className="text-red-600">User not found.</p>
        <button onClick={() => router.back()} className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white">Go Back</button>
      </div>
    );
  }

  const username = user.referralCode || user.name.toLowerCase().replace(/\s+/g, "");

  return (
    <>
      {balanceModal && (
        <Modal title={balanceModal === "add" ? "Add Balance" : "Subtract Balance"} onClose={() => setBalanceModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Amount <span className="text-red-500">*</span></label>
              <div className="flex overflow-hidden rounded-lg border border-gray-200 focus-within:border-indigo-400">
                <input
                  type="number"
                  min="0"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  placeholder="Please provide positive amount"
                  className="flex-1 px-3 py-2 text-sm text-gray-700 outline-none"
                />
                <span className="flex items-center bg-gray-50 px-3 text-sm font-medium text-gray-500">Rs</span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Remark <span className="text-red-500">*</span></label>
              <textarea
                value={balanceRemark}
                onChange={(e) => setBalanceRemark(e.target.value)}
                placeholder="Remark"
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400"
              />
            </div>
            <button
              onClick={handleBalanceSubmit}
              disabled={balanceSaving || !balanceAmount}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {balanceSaving ? "Processing..." : "Submit"}
            </button>
          </div>
        </Modal>
      )}

      {banModal && (
        <Modal title="Ban User" onClose={() => setBanModal(false)}>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">If you ban this user he/she won&apos;t be able to access his/her dashboard.</p>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Reason <span className="text-red-500">*</span></label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400"
              />
            </div>
            <button
              onClick={handleBanSubmit}
              disabled={banSaving || !banReason.trim()}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {banSaving ? "Banning..." : "Submit"}
            </button>
          </div>
        </Modal>
      )}

      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            User Detail - <span className="text-indigo-600">@{username}</span>
          </h1>
          {user.isBanned && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">Banned</span>
          )}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Balance", value: `Rs ${Number(stats.balance).toLocaleString("en-PK", { minimumFractionDigits: 2 })}`, bg: "bg-indigo-600", href: `/admin/approved-users/${id}/transactions` },
            { label: "Deposits", value: `Rs ${stats.totalDeposited.toLocaleString("en-PK", { minimumFractionDigits: 2 })}`, bg: "bg-blue-500", href: `/admin/approved-users/${id}/deposits` },
            { label: "Withdrawals", value: `Rs ${stats.totalWithdrawn.toLocaleString("en-PK", { minimumFractionDigits: 2 })}`, bg: "bg-teal-600", href: null },
            { label: "Transactions", value: stats.totalTransactions.toString(), bg: "bg-blue-700", href: `/admin/approved-users/${id}/transactions` },
          ].map((card) => (
            <div key={card.label} className={`rounded-xl ${card.bg} p-5 text-white shadow-sm`}>
              <p className="text-xl font-bold">{card.value}</p>
              <p className="mt-1 text-xs font-medium text-white/80">{card.label}</p>
              {card.href ? (
                <button onClick={() => router.push(card.href!)} className="mt-2 text-xs font-medium text-white/70 hover:text-white">View All</button>
              ) : (
                <button className="mt-2 text-xs font-medium text-white/70 hover:text-white">View All</button>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setBalanceModal("add")} className="flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Balance
          </button>
          <button onClick={() => setBalanceModal("subtract")} className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
            Balance
          </button>
          <button onClick={() => router.push(`/admin/approved-users/${id}/logins`)} className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-600">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14" /></svg>
            Logins
          </button>
          <button onClick={() => router.push(`/admin/approved-users/${id}/notifications`)} className="flex items-center gap-1.5 rounded-lg bg-gray-400 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-500">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            Notifications
          </button>
          <button onClick={handleLoginAsUser} className="flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-white px-4 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Login as User
          </button>
          {user.isBanned ? (
            <button onClick={handleUnban} className="rounded-lg bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600">
              Unban User
            </button>
          ) : (
            <button onClick={() => setBanModal(true)} className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
              Ban User
            </button>
          )}
          <button className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Fanta Earn
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
            Fanta Earn
          </button>
        </div>

        {/* Information Form */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-gray-700">
            Information of <span className="text-indigo-600">@{username}</span>
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Email <span className="text-red-500">*</span></label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Mobile Number <span className="text-red-500">*</span></label>
              <div className="flex overflow-hidden rounded-lg border border-gray-200 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400">
                <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-500">+92</span>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm text-gray-700 outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Level</label>
              <input type="number" value={level} onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Total Team</label>
              <input type="text" readOnly value={stats.teamCount}
                className="w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Reference Code</label>
              <input type="text" value={referralCode} onChange={(e) => setReferralCode(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Select Plan</label>
              <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400">
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-gray-500">Address</label>
              <input type="text"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank if you don't want to change"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400" />
            </div>
          </div>

          {/* Verification Status */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Verification Status</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Email Verification", active: true },
                { label: "Mobile Verification", active: false },
                { label: "2FA Verification", active: false },
                { label: "KYC", active: false },
              ].map((v) => (
                <button key={v.label}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${v.active
                    ? "border-green-300 bg-green-50 text-green-600 hover:bg-green-100"
                    : "border-gray-200 bg-white text-gray-400 hover:bg-gray-50"}`}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button onClick={handleSave} disabled={saving}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 sm:w-auto sm:px-8">
              {saving ? "Saving..." : "Submit"}
            </button>
            {saveMsg && (
              <span className={`text-sm font-medium ${saveMsg.includes("success") ? "text-green-600" : "text-red-500"}`}>
                {saveMsg}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
