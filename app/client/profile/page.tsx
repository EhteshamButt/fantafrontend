"use client";

import { useClientUser } from "../layout";

export default function ProfilePage() {
  const user = useClientUser();

  return (
    <div className="flex min-h-[80vh] flex-col items-center px-4 pt-8" style={{ backgroundColor: "#001f3f" }}>
      <h1 className="text-4xl font-bold text-white mb-6">Profile</h1>

      <div className="w-full rounded-2xl p-7 flex flex-col items-center" style={{ backgroundColor: "#ff6c00", maxWidth: "432px" }}>
        {/* Avatar */}
        <div className="mb-5 flex items-center justify-center rounded-full border-4 border-white overflow-hidden" style={{ width: "126px", height: "126px", backgroundColor: "#ff6c00" }}>
          <img
            src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775666576/fatbabotle_lpufpb.png"
            alt="Fanta"
            style={{ width: "108px", height: "108px", objectFit: "contain" }}
          />
        </div>

        <p className="text-xl font-bold text-white mb-4">Fanta Earn</p>

        <p className="text-lg font-bold text-white mb-2">{user?.email}</p>
        {user?.phone && <p className="text-lg font-bold text-white mb-2">{user.phone}</p>}
        <p className="text-lg font-bold text-white mb-2">Level: {user?.level ?? 1}</p>
        <p className="text-lg font-bold text-white mb-2">Daily Limit: {user?.dailyLimit ?? 0}</p>
      </div>
    </div>
  );
}
