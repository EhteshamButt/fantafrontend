"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { useClientUser } from "../layout";

interface TeamMember {
  id: string;
  email: string;
  name: string;
  level: number;
  createdAt: string;
}

const LEVEL_THRESHOLDS = [3, 15, 45, 75, 170, 260, 350, 400, 435, 500, 800, 1000];

function getNextLevelInfo(currentLevel: number, totalCount: number) {
  if (currentLevel >= 12) return null;
  const needed = LEVEL_THRESHOLDS[currentLevel];
  return { nextLevel: currentLevel + 1, needed, remaining: needed - totalCount };
}

export default function TeamPage() {
  const user = useClientUser();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [calculatedLevel, setCalculatedLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    authApi.team()
      .then((data) => {
        setMembers(data.members);
        setTotalCount(data.totalCount);
        setCalculatedLevel(data.calculatedLevel);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load team"))
      .finally(() => setLoading(false));
  }, []);

  const nextLevelInfo = getNextLevelInfo(calculatedLevel, totalCount);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-300 border-t-orange-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 pt-6 pb-6" style={{ backgroundColor: "#001f3f", minHeight: "100vh" }}>
      {/* Logo */}
      <img
        src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775556882/fanta_logo_1_rchhe0.png"
        alt="Fanta"
        className="mb-10 object- "
        style={{ width: "320px", height: "150px" }}
      />

      {/* Header */}
      <h1 className="text-3xl font-bold text-white mb-6">My Team</h1>

      {error && (
        <div className="mb-4 w-full max-w-lg rounded-lg bg-red-500/20 px-4 py-3 text-center text-sm font-medium text-red-400">
          {error}
        </div>
      )}

      {/* Stats Card */}
      <div className="w-full max-w-lg rounded-2xl p-5 mb-5" style={{ backgroundColor: "#ff6c00" }}>
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <p className="text-3xl font-extrabold text-white">{totalCount}</p>
            <p className="text-sm font-semibold text-orange-100 mt-1">Total Members</p>
          </div>
          <div className="w-px bg-orange-300 self-stretch mx-3" />
          <div className="text-center flex-1">
            <p className="text-3xl font-extrabold text-white">
              {calculatedLevel === 0 ? "—" : `L${calculatedLevel}`}
            </p>
            <p className="text-sm font-semibold text-orange-100 mt-1">Your Level</p>
          </div>
          <div className="w-px bg-orange-300 self-stretch mx-3" />
          <div className="text-center flex-1">
            <p className="text-3xl font-extrabold text-white">{user?.dailyLimit ?? 0}</p>
            <p className="text-sm font-semibold text-orange-100 mt-1">Daily Limit</p>
          </div>
        </div>

        {/* Next level progress */}
        {nextLevelInfo ? (
          <div className="mt-4 pt-4 border-t border-orange-300">
            <p className="text-sm font-semibold text-orange-100 text-center">
              {nextLevelInfo.remaining} more member{nextLevelInfo.remaining !== 1 ? "s" : ""} to reach Level {nextLevelInfo.nextLevel}
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-orange-300/40">
              <div
                className="h-2 rounded-full bg-white"
                style={{
                  width: `${Math.min(100, (totalCount / nextLevelInfo.needed) * 100)}%`,
                }}
              />
            </div>
          </div>
        ) : calculatedLevel === 12 ? (
          <p className="mt-3 text-center text-sm font-bold text-white">Max Level Reached!</p>
        ) : null}
      </div>

      {/* Level table */}
      <div className="w-full max-w-lg rounded-2xl overflow-hidden mb-5" style={{ backgroundColor: "#0a3060" }}>
        <p className="px-4 py-3 text-base font-bold text-white border-b border-white/10">Level Requirements</p>
        <div className="divide-y divide-white/10">
          {LEVEL_THRESHOLDS.map((threshold, idx) => {
            const lvl = idx + 1;
            const active = calculatedLevel === lvl;
            const achieved = calculatedLevel > lvl;
            return (
              <div
                key={lvl}
                className="flex justify-between items-center px-4 py-2.5"
                style={active ? { backgroundColor: "#ff6c00" } : {}}
              >
                <span className={`text-sm font-semibold ${active ? "text-white" : achieved ? "text-green-400" : "text-gray-300"}`}>
                  Level {lvl}
                </span>
                <span className={`text-sm ${active ? "text-white font-bold" : achieved ? "text-green-400" : "text-gray-400"}`}>
                  {threshold} members {achieved ? "✓" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Members list */}
      <div className="w-full max-w-lg">
        <p className="text-base font-bold text-white mb-3">
          Referred Members ({totalCount})
        </p>
        {members.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "#0a3060" }}>
            <p className="text-gray-400">No referred members yet.</p>
            <p className="text-sm text-gray-500 mt-1">Share your referral code to grow your team.</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#0a3060" }}>
            <div className="divide-y divide-white/10">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.email}</p>
                  </div>
                  <div
                    className="rounded-full px-3 py-1 text-xs font-bold text-white"
                    style={{ backgroundColor: m.level > 0 ? "#ff6c00" : "#555" }}
                  >
                    {m.level > 0 ? `L${m.level}` : "L0"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
