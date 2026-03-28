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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Rejected Users</h1>
        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
          {data.length} rejected
        </span>
      </div>
      <DataTable
        columns={columns}
        data={data}
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
