"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import DataTable from "../components/DataTable";

interface TodayApproved {
  _id: string;
  userId: { _id: string; name: string; email: string };
  packageName: string;
  amount: number;
  updatedAt: string;
}

const columns = [
  {
    key: "userName",
    label: "User Name",
    render: (item: TodayApproved) => item.userId?.name || "Unknown",
  },
  {
    key: "userEmail",
    label: "Email",
    render: (item: TodayApproved) => item.userId?.email || "",
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

  useEffect(() => {
    adminApi
      .getTodayApprovedUsers()
      .then((res) => setData(res as TodayApproved[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Today Approved Users</h1>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          {data.length} today
        </span>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="No approvals today"
      />
    </div>
  );
}
