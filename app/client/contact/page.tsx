"use client";

import { useRouter } from "next/navigation";
import { authApi, clearAccessToken } from "@/lib/api";

export default function ContactPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try { await authApi.logout(); } finally { clearAccessToken(); router.push("/login"); }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center pt-0 px-4">
      {/* Fanta Bottle Icon */}
      <img
        src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775666576/fatbabotle_lpufpb.png"
        alt="Fanta"
        className="mb-4 object- "
        style={{ width: "320px", height: "150px" }}
      />
      {/* Logout button fixed top-right */}
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
      {/* WhatsApp Title */}
      <h1 className=" font-bold text-white text-4xl mb-6">Whatsapp</h1>

      {/* Community Button */}
      <a
        href="https://chat.whatsapp.com/IzeWU7djtXaAlTIGMeqrGS"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full mb-3 flex flex-col items-center justify-center gap-2 rounded-2xl text-white transition"
        style={{ backgroundColor: "#075e54", maxWidth: "468px", paddingTop: "19.4px", paddingBottom: "19.4px" }}
      >
        {/* WhatsApp Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-10 w-10" fill="white">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.47.67 4.784 1.836 6.77L2 30l7.418-1.812A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.836-1.598l-.418-.248-4.402 1.074 1.11-4.28-.272-.44A11.46 11.46 0 0 1 4.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5zm6.29-8.61c-.344-.172-2.036-1.004-2.352-1.118-.316-.114-.546-.172-.776.172-.23.344-.89 1.118-1.09 1.348-.2.23-.4.258-.744.086-.344-.172-1.452-.536-2.766-1.708-1.022-.912-1.712-2.038-1.912-2.382-.2-.344-.02-.53.15-.702.154-.154.344-.4.516-.6.172-.2.23-.344.344-.574.114-.23.058-.43-.028-.602-.086-.172-.776-1.872-1.062-2.562-.28-.674-.564-.582-.776-.592l-.66-.012c-.23 0-.602.086-.916.43s-1.204 1.176-1.204 2.868 1.232 3.326 1.404 3.556c.172.23 2.426 3.706 5.876 5.196.822.354 1.464.566 1.964.724.824.262 1.574.224 2.168.136.66-.098 2.036-.832 2.322-1.636.286-.804.286-1.492.2-1.636-.084-.144-.314-.23-.658-.4z"/>
        </svg>
        <span className="text-base font-semibold">Community</span>
      </a>

      {/* Offers Button */}
      <a
        href="https://chat.whatsapp.com/E86z95nFdt8DXGYRn81jTs"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full mb-6 flex flex-col items-center justify-center gap-2 rounded-2xl text-white transition"
        style={{ backgroundColor: "#075e54", maxWidth: "468px", paddingTop: "19.4px", paddingBottom: "19.4px" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-10 w-10" fill="white">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.47.67 4.784 1.836 6.77L2 30l7.418-1.812A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.836-1.598l-.418-.248-4.402 1.074 1.11-4.28-.272-.44A11.46 11.46 0 0 1 4.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5zm6.29-8.61c-.344-.172-2.036-1.004-2.352-1.118-.316-.114-.546-.172-.776.172-.23.344-.89 1.118-1.09 1.348-.2.23-.4.258-.744.086-.344-.172-1.452-.536-2.766-1.708-1.022-.912-1.712-2.038-1.912-2.382-.2-.344-.02-.53.15-.702.154-.154.344-.4.516-.6.172-.2.23-.344.344-.574.114-.23.058-.43-.028-.602-.086-.172-.776-1.872-1.062-2.562-.28-.674-.564-.582-.776-.592l-.66-.012c-.23 0-.602.086-.916.43s-1.204 1.176-1.204 2.868 1.232 3.326 1.404 3.556c.172.23 2.426 3.706 5.876 5.196.822.354 1.464.566 1.964.724.824.262 1.574.224 2.168.136.66-.098 2.036-.832 2.322-1.636.286-.804.286-1.492.2-1.636-.084-.144-.314-.23-.658-.4z"/>
        </svg>
        <span className="text-base font-semibold">Offers</span>
      </a>

      {/* Channel Link */}
      <a
        href="https://www.whatsapp.com/channel/0029Vb6W3rJ1SWt4zTReUg3k"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 text-white hover:opacity-80 transition"
      >
        {/* Broadcast / Channel Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="white" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3" fill="white" stroke="none"/>
          <path strokeLinecap="round" d="M6.3 6.3a7 7 0 0 0 0 11.4M17.7 6.3a7 7 0 0 1 0 11.4"/>
          <path strokeLinecap="round" d="M3.5 3.5a12 12 0 0 0 0 17M20.5 3.5a12 12 0 0 1 0 17"/>
        </svg>
        <span className="text-base font-semibold">Channel</span>
      </a>
    </div>
  );
}
