"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import DataTable from "../components/DataTable";
import ScreenshotModal from "../components/ScreenshotModal";

interface RejectedPayment {
  id: string;
  user?: { id: string; name: string; email: string };
  packageName: string;
  amount: number;
  trxId: string;
  screenshotUrl: string;
  createdAt: string;
}

export default function RejectedUsersPage() {
  const [data, setData] = useState<RejectedPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    adminApi
      .getRejectedUsers()
      .then((res) => setData(res as RejectedPayment[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      key: "userName",
      label: "User Name",
      render: (item: RejectedPayment) => item.user?.name || "Unknown",
    },
    {
      key: "userEmail",
      label: "Email",
      render: (item: RejectedPayment) => item.user?.email || "",
    },
    { key: "packageName", label: "Package" },
    {
      key: "amount",
      label: "Amount",
      render: (item: RejectedPayment) =>
        `Rs${item.amount.toLocaleString("en-PK")}`,
    },
    {
      key: "trxId",
      label: "TRX ID",
      render: (item: RejectedPayment) => (
        <span className="font-mono text-xs">{item.trxId}</span>
      ),
    },
    {
      key: "screenshot",
      label: "Screenshot",
      render: (item: RejectedPayment) => (
        <button
          onClick={() => setScreenshotUrl(item.screenshotUrl)}
          className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
        >
          View
        </button>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (item: RejectedPayment) =>
        new Date(item.createdAt).toLocaleDateString("en-PK", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
  ];

  const filtered = data.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      item.user?.name.toLowerCase().includes(q) ||
      item.user?.email.toLowerCase().includes(q) ||
      item.trxId.toLowerCase().includes(q);

    const itemDate = new Date(item.createdAt);
    const matchesStart = !startDate || itemDate >= new Date(startDate);
    const matchesEnd = !endDate || itemDate <= new Date(endDate + "T23:59:59");

    return matchesSearch && matchesStart && matchesEnd;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Rejected Users</h1>
        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
          {filtered.length} rejected
        </span>
      </div>

      {/* Search by Email / Username / TRX ID */}
      <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <input
          type="text"
          placeholder="Email / Username / TRX ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-5 py-3 text-sm text-gray-500 outline-none placeholder:text-gray-400"
        />
        <button className="flex items-center justify-center bg-indigo-600 px-5 hover:bg-indigo-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </button>
      </div>

      {/* Search by Date Range */}
      <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-1 items-center gap-2 px-5 py-3">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-sm text-gray-500 outline-none"
          />
          <span className="text-gray-400">–</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-sm text-gray-500 outline-none"
          />
        </div>
        <button className="flex items-center justify-center bg-indigo-600 px-5 hover:bg-indigo-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No rejected payments"
      />

      {screenshotUrl && (
        <ScreenshotModal
          url={screenshotUrl}
          onClose={() => setScreenshotUrl(null)}
        />
      )}
    </div>
  );
}
