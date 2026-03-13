"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    authApi
      .profile()
      .then((data) => {
        const user = data as User;
        switch (user.role) {
          case "admin":
            router.replace("/admin/dashboard");
            break;
          case "client":
            router.replace("/client/dashboard");
            break;
          default:
            router.replace("/user/dashboard");
        }
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <p className="text-zinc-500">Redirecting...</p>
    </div>
  );
}
