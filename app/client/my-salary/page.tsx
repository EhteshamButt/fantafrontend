"use client";

import { useClientUser } from "../layout";

export default function MySalaryPage() {
  const user = useClientUser();

  const levelSalary: Record<number, number> = {
    0: 0,
    1: 50,
    2: 100,
    3: 200,
    4: 400,
    5: 700,
    6: 1000,
    7: 1500,
    8: 2000,
    9: 3000,
    10: 4500,
    11: 7000,
    12: 10000,
  };

  const level = user?.level ?? 0;
  const dailySalary = levelSalary[level] ?? 0;

  return (
    <div className="flex flex-col items-center px-4 pt-6 pb-6" style={{ backgroundColor: "#001f3f", minHeight: "100vh" }}>
      {/* Logo */}
      <img
        src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775556882/fanta_logo_1_rchhe0.png"
        alt="Fanta"
        style={{ width: "320px", height: "150px", objectFit: "contain" }}
        className="mb-10"
      />

      <h1 className="text-3xl font-bold text-white mb-6">My Salary</h1>

      {/* Main card */}
      <div className="w-full max-w-lg rounded-2xl p-6" style={{ backgroundColor: "#ff6c00" }}>
        <div className="flex justify-between items-center mb-4">
          <div className="text-center flex-1">
            <p className="text-4xl font-extrabold text-white">{level === 0 ? "—" : `L${level}`}</p>
            <p className="text-sm font-semibold text-orange-100 mt-1">Current Level</p>
          </div>
          <div className="w-px bg-orange-300 self-stretch mx-3" />
          <div className="text-center flex-1">
            <p className="text-4xl font-extrabold text-white">{user?.dailyLimit ?? 0}</p>
            <p className="text-sm font-semibold text-orange-100 mt-1">Daily Tasks</p>
          </div>
          <div className="w-px bg-orange-300 self-stretch mx-3" />
          <div className="text-center flex-1">
            <p className="text-4xl font-extrabold text-white">{dailySalary}</p>
            <p className="text-sm font-semibold text-orange-100 mt-1">Daily Rs</p>
          </div>
        </div>
      </div>

      {/* Salary table */}
      <div className="w-full max-w-lg rounded-2xl overflow-hidden mt-5" style={{ backgroundColor: "#0a3060" }}>
        <p className="px-4 py-3 text-base font-bold text-white border-b border-white/10">Salary by Level</p>
        <div className="divide-y divide-white/10">
          {Object.entries(levelSalary).filter(([lvl]) => Number(lvl) > 0).map(([lvl, salary]) => {
            const active = Number(lvl) === level;
            return (
              <div
                key={lvl}
                className="flex justify-between items-center px-4 py-3"
                style={active ? { backgroundColor: "#ff6c00" } : {}}
              >
                <span className={`text-sm font-semibold ${active ? "text-white" : Number(lvl) < level ? "text-green-400" : "text-gray-300"}`}>
                  Level {lvl}
                </span>
                <span className={`text-sm font-bold ${active ? "text-white" : Number(lvl) < level ? "text-green-400" : "text-gray-400"}`}>
                  Rs {salary} / day
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
