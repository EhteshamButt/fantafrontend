"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import DataTable from "../components/DataTable";

interface ApprovedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "role",
    label: "Role",
    render: (item: ApprovedUser) => (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
          item.role === "admin"
            ? "bg-red-100 text-red-700"
            : item.role === "client"
            ? "bg-purple-100 text-purple-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {item.role}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Member Since",
    render: (item: ApprovedUser) =>
      new Date(item.createdAt).toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
];

export default function ApprovedUsersPage() {
  const [users, setUsers] = useState<ApprovedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getApprovedUsers()
      .then((data) => setUsers(data as ApprovedUser[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">All Approved Users</h1>
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
          {users.length} users
        </span>
      </div>
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="No approved users yet"
      />
    </div>
  );
}
