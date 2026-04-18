"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import DataTable from "../components/DataTable";

interface TodayApproved {
  id: string;
  user?: { id: string; name: string; email: string };
  packageName: string;
  amount: number;
  updatedAt: string;
}

const columns = [
  {
    key: "userName",
    label: "User Name",
    render: (item: TodayApproved) => item.user?.name || "Unknown",
  },
  {
    key: "userEmail",
    label: "Email",
    render: (item: TodayApproved) => item.user?.email || "",
  },
  { key: "packageName", label: "Package" },
  {
    key: "amount",
    label: "Amount",
    render: (item: TodayApproved) => `Rs${item.amount.toLocaleString("en-PK")}`,
  },
  {
    key: "updatedAt",
    label: "Approved At",
    render: (item: TodayApproved) =>
      new Date(item.updatedAt).toLocaleTimeString("en-PK", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
  },
];

export default function TodayApprovedPage() {
  const [data, setData] = useState<TodayApproved[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi
      .getTodayApprovedUsers()
      .then((res) => setData(res as TodayApproved[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter((item) => {
    const q = search.toLowerCase();
    return (
      !q ||
      item.user?.name.toLowerCase().includes(q) ||
      item.user?.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Today Approved Users</h1>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          {filtered.length} today
        </span>
      </div>
      <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <input
          type="text"
          placeholder="Search by name or email..."
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
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No approvals today"
      />
    </div>
  );
}
