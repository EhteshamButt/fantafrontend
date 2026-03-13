"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, adminApi, DashboardStats } from "@/lib/api";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [withdrawalRequests, setWithdrawalRequests] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        try { await authApi.refresh(); } catch { /* ignore */ }
        const profile = (await authApi.profile()) as AdminUser;
        if (cancelled) return;
        if (profile.role !== "admin") {
          router.replace("/login");
          return;
        }
        setUser(profile);
        try {
          const stats: DashboardStats = await adminApi.getStats();
          if (!cancelled) {
            setPendingRequests(stats.pendingRequests);
            setWithdrawalRequests(stats.pendingWithdrawals ?? 0);
          }
        } catch { /* ignore */ }
      } catch {
        if (!cancelled) router.replace("/login");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    init();
    return () => { cancelled = true; };
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a1628]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-300 border-t-purple-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <AdminSidebar
          pendingRequests={pendingRequests}
          withdrawalRequests={withdrawalRequests}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-50 h-full w-64">
            <AdminSidebar
              pendingRequests={pendingRequests}
              withdrawalRequests={withdrawalRequests}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:ml-64">
        <AdminHeader
          userName={user.name}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
