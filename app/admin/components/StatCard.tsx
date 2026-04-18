"use client";

import Link from "next/link";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  viewAllHref?: string;
  todayValue?: string;
  large?: boolean;
}

export default function StatCard({
  title,
  value,
  icon,
  iconBg,
  viewAllHref,
  todayValue,
  large,
}: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-white p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md ${
        large ? "col-span-full sm:col-span-1" : ""
      }`}
    >
      {/* View All badge */}
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="absolute right-3 top-3 rounded bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-600 hover:bg-blue-200 transition-colors"
        >
          View All
        </Link>
      )}

      {/* Today badge */}
      {todayValue && (
        <span className="absolute right-3 top-3 max-w-[45%] truncate rounded bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
          Today: {todayValue}
        </span>
      )}

      <div className="flex items-center gap-3 sm:gap-4">
        <div
          className={`flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className={`truncate font-bold text-gray-800 ${large ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}>
            {typeof value === "number" ? value.toLocaleString("en-PK") : value}
          </p>
          <p className="truncate text-xs sm:text-sm text-gray-500">{title}</p>
        </div>
      </div>

      {/* Decorative background shape */}
      <div className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gray-100/50" />
    </div>
  );
}

/* Special large card for Total Users (purple gradient like screenshot) */
export function TotalUsersCard({ value }: { value: number }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 p-4 sm:p-6 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-purple-200">Total Users</p>
          <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-white truncate">
            {value.toLocaleString("en-PK")}
          </p>
        </div>
        <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-white/20">
          <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
