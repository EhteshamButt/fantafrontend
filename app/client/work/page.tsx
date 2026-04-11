"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { useClientUser } from "../layout";

const LEVEL_THRESHOLDS = [3, 15, 45, 75, 170, 260, 350, 400, 435, 500, 800, 1000];

function getNextLevelInfo(currentLevel: number, totalCount: number) {
  if (currentLevel >= 12) return null;
  const needed = LEVEL_THRESHOLDS[currentLevel];
  return { nextLevel: currentLevel + 1, needed, remaining: Math.max(0, needed - totalCount) };
}

export default function WorkPage() {
  const user = useClientUser();
  const [totalCount, setTotalCount] = useState(0);
  const [calculatedLevel, setCalculatedLevel] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.team()
      .then((data) => {
        setTotalCount(data.totalCount);
        setCalculatedLevel(data.calculatedLevel);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const level = calculatedLevel || user?.level || 0;
  const nextLevelInfo = getNextLevelInfo(level, totalCount);

  return (
    <div className="min-h-screen pb-24 flex flex-col items-center" style={{ backgroundColor: "#001f3f" }}>
      {/* Fanta Logo */}
      <div className="flex justify-center pt-6">
           <img
        src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775556882/fanta_logo_1_rchhe0.png"
        alt="Fanta"
        style={{ width: "320px", height: "150px", objectFit: " " }}
        className="mb-10"
      />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-center text-white mt-4 leading-snug">
        Fanta<br />Work Room
      </h1>

      {/* Instruction */}
      <p className="text-lg font-semibold text-center text-white mt-3 mb-2 px-4">
        Click on Bottle to complete the Task
      </p>

      {/* 7 Bottle Images */}
      <div className="flex flex-col items-center gap-10 my-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <img
            key={i}
            src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775666576/fatbabotle_lpufpb.png"
            alt="Fanta Bottle"
            className="object- "
            style={{ width: "320px", height: "150px" }}
          />
        ))}
      </div>

      {/* Stats Card */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-300 border-t-orange-600" />
        </div>
      ) : (
        <div className="w-full max-w-sm mx-4 mt-4 rounded-2xl p-6 mb-10 shadow-2xl border-4 border-yellow-500 bg-linear-to-r from-purple-900 via-pink-800 to-red-800">
          {/* Level */}
          <h3 className="text-3xl font-bold text-yellow-300 text-center mb-4">
            Level {level} / 12
          </h3>

          {/* Referrals & Task Limit */}
          <div className="text-center text-white space-y-3 mb-5">
            <p className="text-xl">Total Referrals: <strong className="text-yellow-400">{totalCount}</strong></p>
            <p className="text-xl">Task Limit: <strong className="text-green-400">{user?.dailyLimit ?? 0}</strong></p>
          </div>

          {/* Next Level Box */}
          {nextLevelInfo ? (
            <div className="rounded-xl p-5 border-2 border-yellow-600" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
              <p className="text-yellow-300 font-bold text-lg text-center">
                Next Level {nextLevelInfo.nextLevel} → {nextLevelInfo.needed} Referrals
              </p>
              <p className="text-center text-gray-200 mt-4">
                Only <strong className="text-yellow-400">{nextLevelInfo.remaining}</strong> more referrals needed!
              </p>
            </div>
          ) : (
            <div className="rounded-xl p-5 border-2 border-yellow-600 text-center" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
              <p className="text-yellow-300 font-bold text-lg">Max Level Reached!</p>
            </div>
          )}

          {/* Referral Code */}
          <div className="mt-6 p-5 bg-white text-black rounded-xl font-mono text-center break-all shadow-lg">
            <p className="text-sm mb-1">Your Referral Code:</p>
            <strong className="text-blue-700 text-lg">{user?.referralCode ?? "—"}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
