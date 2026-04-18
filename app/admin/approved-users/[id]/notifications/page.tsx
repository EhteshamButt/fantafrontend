"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";

interface NotificationRecord {
  id: string;
  subject: string;
  message: string;
  sentVia: string;
  createdAt: string;
  user?: { name: string };
}

export default function UserNotificationsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    Promise.all([
      adminApi.getNotifications(id),
      adminApi.getUserDetail(id),
    ])
      .then(([notifs, detail]) => {
        setNotifications(notifs);
        setUsername(detail.user.referralCode || detail.user.name.toLowerCase().replace(/\s+/g, ""));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Notifications Sent to <span className="text-indigo-600">{username}</span>
        </h1>
      </div>

      {/* Card */}
      <div className="rounded-xl bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-700">
            Notifications Sent to {username}
          </h2>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3 p-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-12 rounded-lg bg-gray-200" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="whitespace-nowrap px-6 py-3 text-xs font-semibold text-gray-500">User</th>
                  <th className="whitespace-nowrap px-6 py-3 text-xs font-semibold text-gray-500">Subject</th>
                  <th className="whitespace-nowrap px-6 py-3 text-xs font-semibold text-gray-500">Sent Via</th>
                  <th className="whitespace-nowrap px-6 py-3 text-xs font-semibold text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400 bg-gray-50">
                      No notifications found
                    </td>
                  </tr>
                ) : (
                  notifications.map((n) => (
                    <tr key={n.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-indigo-600">@{username}</td>
                      <td className="px-6 py-3 text-gray-700">{n.subject}</td>
                      <td className="px-6 py-3 text-gray-500">{n.sentVia}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-500">
                        {new Date(n.createdAt).toLocaleString("en-PK", {
                          year: "numeric", month: "2-digit", day: "2-digit",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
