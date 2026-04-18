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
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi
      .getApprovedUsers()
      .then((data) => setUsers(data as ApprovedUser[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">All Approved Users</h1>
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
          {filtered.length} users
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
        emptyMessage="No approved users yet"
      />
    </div>
  );
}
