"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, clearAccessToken } from "@/lib/api";
import { useClientUser } from "../layout";

interface TeamMember {
  id: string;
  email: string;
  name: string;
  level: number;
  createdAt: string;
}

export default function TeamPage() {
  const user = useClientUser();
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [calculatedLevel, setCalculatedLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try { await authApi.logout(); } finally { clearAccessToken(); router.push("/login"); }
  };

  useEffect(() => {
    authApi
      .team()
      .then((data) => {
        setMembers(data.members);
        setTotalCount(data.totalCount);
        setCalculatedLevel(data.calculatedLevel);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load team")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#001f3f" }}>
      {/* Logout */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition active:scale-95"
        style={{ background: "#ff6c00" }}
        title="Logout"
      >
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>

      {/* Logo */}
      <div className="flex justify-center pt-6 pb-2">
        <img
          src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775556882/fanta_logo_1_rchhe0.png"
          alt="Fanta"
          className="h-36 w-full max-w-75 object-contain"
        />
      </div>

      {/* Title */}
      <h1 className="mb-6 text-center text-3xl font-bold text-white">Team</h1>

      <div className="mx-auto max-w-lg px-4">
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/20 px-4 py-3 text-center text-sm font-medium text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-300 border-t-orange-600" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">Total Members</span>
                <span className="text-lg font-bold text-white">{totalCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">Your Level</span>
                <span className="text-lg font-bold text-white">{calculatedLevel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">Daily Task Limit</span>
                <span className="text-lg font-bold text-white">{user?.dailyLimit ?? 0}</span>
              </div>
            </div>

            {/* Referred Users */}
            <p className="mb-3 text-lg font-bold text-white">Referred Users</p>

            {members.length === 0 ? (
              <p className="py-6 text-gray-400">No referred members yet.</p>
            ) : (
              <div className="divide-y divide-white/20">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-4">
                    <span className="text-sm text-white">
                      Email: {m.email}
                    </span>
                    <span className="text-sm font-bold text-white">
                      Level: {m.level}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
