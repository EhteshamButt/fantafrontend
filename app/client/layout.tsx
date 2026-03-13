"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import BottomNav from "./components/BottomNav";

interface ClientUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const ClientUserContext = createContext<ClientUser | null>(null);
export const useClientUser = () => useContext(ClientUserContext);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        try { await authApi.refresh(); } catch { /* ignore */ }
        const profile = (await authApi.profile()) as ClientUser;
        if (cancelled) return;
        if (profile.role !== "client") {
          router.replace("/login");
          return;
        }
        setUser(profile);
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-300 border-t-orange-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <ClientUserContext.Provider value={user}>
      <div className="flex min-h-screen flex-col bg-[#0a1628]">
        <div className="flex-1 pb-20">{children}</div>
        <BottomNav />
      </div>
    </ClientUserContext.Provider>
  );
}
