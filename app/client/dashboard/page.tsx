"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi, clearAccessToken } from "@/lib/api";
import { useClientUser } from "../layout";

const actionCards = [
  {
    label: "Withdraw",
    href: "/client/withdraw",
    bg: "bg-orange-500",
    icon: (
      <img src="data:image/png;base64,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" className="h-12 w-12" alt="withdraw" />
    ),
  },
  {
    label: "Team",
    href: "/client/team",
    bg: "bg-orange-500",
    icon: (
 <span>
<img src="data:image/png;base64,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"/>                </span>    ),
  },
  {
    label: "Guide",
    href: "/client/guide",
    bg: "bg-orange-500",
    icon: (
      <span>
<img src="data:image/png;base64,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"/>                </span>
     ),
  },
  {
    label: "Official\nChannel",
    href: "/client/official-channel",
    bg: "bg-orange-500",
    icon: (
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAACWElEQVR4nO2ZQW8SQRTH9+Sn0LMfxk9i9hkP3uihV8juajSNFtPM4GVHaIB49eAdwrW0YtpoCr24YWgT2mQPfWbWlFBbYVh23Rl5L/lfZmZh32/evPcYHIeMjIxMw7a3Gw8Cl1V8l50FwNEyjXzgZeWDk9Z84GUDHFlLyofUAALgI/Uho6NjxKuJVRr2j2eRsA4AVCrambS6ef+1AVxfjgt3ZlWpd84MQCxPrBQBAIoApCMAlAOQkmBeVWB60MGIc4xqDKf9zuZVgajG8Ofbd4mi2u11siFmc7qS+2Lh8/Pz5gPYTwPg48Ln5+eNADDtdxIIyvlpv1t4yFMjJA3qBGWKHLAsL1gVATJFDliWF6wCEBsgAgAUAZjrEfja6eFuKcRqKcRBt7d5R6BaCmdfUt0Kb82FlWbuF57Ca5kLQHit/x/AoNtLICjnv23iEYgNV6EAwhxywLKQNwqAyCEHWAUgNkAEACgCkDpBMLgTFHNJTbdqrJIIje8ExZwzulXDKAAD6gRPCi91VAYl9QFIjZCkThCpFZb0WwBz7wPCSvNOI2LyWOYAgnsaI5PHCABkHAHCa90JO5PH6D4A6EIEtY6AB/yJD2yY9SXmv9Lf/prTjoDA5adFO7E2hD/uI1YDAL8XyqMvVuq+kkgA5GpH4EItHPY+F76babTz4kPi6PjH4Wz3x98PbwBMNACwtlpc94SVEFpvGomzzdefEgjK+frLdqzGfGD1pQBePd97HAAbF53IspYPLCo/e//Q0TH/KXsUAG/4Lju33nGXnaud13aejIzM2ST7BVTHHTSQo15LAAAAAElFTkSuQmCC" className="h-12 w-12" alt="official-channel" />
    ),
  },
  {
    label: "Salary",
    href: "/client/salary-overview",
    bg: "bg-orange-500",
    icon: (
      <span>
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAALG0lEQVR4nO2deVAUVx7He+/dqt2trdo/trJX7VZlt5J4KyiI4okgrMoh3qhxxVsrrtFEKWC9MCooEIkgopFIRF2NVxSNFzq8Bq/gvaIbEOe9Ueb1IJ4oM/y2XiNkgLnpoXuY/lb9SpxpmNfv07/3e793DcepUqVKlSpVqlSpUqVKlSpVqlSpUqVKlSpVitIegB+V6IkPEvASnuLDSMC3eEoMPMVGRMkr9jMS8E1eIF/xAl7O63UDj0LZz+Qud4cTX/Xgb4jiDLHyBQJOGSXViJIsVIV7yn0fHi/e8KAre9oRxSanQViEg49pqrXd5b4vj9MlgJ/wlMSLzZAUIJpDqeMFsvFMefnP5b5PjxBfrfsLT8kVyUG0MERJKWsK5b5fRYun5F1ESaW7YZjFF6FI0PaV+74VqSI98UWU0HaD0WT4KaK63nLfv6J0qarqLSRgXXuCeGmsAwsq47xdZwB+jCg51/6e0bL5wtdQZeUvOG8XL5CkdvSAVmLXtbi+zNt7VLWye8f3XmL06jyFpySvvWLF49e1Tf+34BX21PG9pkTQdZIsA5fQEMX1RdXaHpy3CVHyiZwV3+gdjd7SounazHmTAOAHiOJyub3BqlFiuAE3fsp5uthNFOt1gxHF6xEl53mB3EUCfoYE8pyn5D7r3jLPQBR/IHul22u6DGQA56k68+jRL3kBf8RTXCV3RfKSGf4354kq0uNwRIle/gokUtt+ztMybF7AG1ivRAGVB1IbovgG50lBmRdIjsM3p9dC+tbNMC0qHCIC/CDcz7dNFtL5PQju9K7TNtK3F0yLHAVrktfA6fI7doAQPecp4gWS7szTtnjhfLESE+bEQt5nGyB/S7rL9lXuFjiSv90ly92UDKsWzoWRPj1gdP++cPCixnq5KanlPEG8QEKdgbFlT574dJ48mA8mo0ERptfdhVkRI2DyiDDWNNmCokEG7QjWInBKVDGlv3Z2Aml2zARYMi3GZgXVGO5Dxup4SE38uJmx12qqK8VrbpUWtXrfWduY8BEsihkHS2OnwL8mjRUflIOXkP0mVyDHzxvwnzmlCVG8zNngGBMaDJ8lJdoEUkXKYPHUSTBvdEQzY6+xp5ldU3L2KMwf0/x9Z21y0GAI7vQeRPXzgxnjo2HBjGlw4IKNZqsZFFxTZND9g1PSmiiW3DkLZFJoMGSuXS57M2UyGmBXZipE+Pd2vfdFcR2iZAqnBPECGW5eOPNRU5tAhg/rOECEhiF6VhceO5HEgGStW9FUKSVnj8LWlNUOWeGx/Q79nvl17Gdr70sCpCFHeYweVb4tK5Bao/G5tdk2WzZxeFAzICaFeMixG1cgftliGDsoEEK7doZxgwMhMWEZfHPvpoMxhZxodwisuycOFgoklRfIC1eeJgZki8KAfFFwCKL794UvMlJAW34DXtXqxX9zN6XA6H7+sPfcScegGLQj3Fn5ZY5MnT2pe2Vz5q2l1ygNSLifrwjj5hUNmIzVrezapUIYOzAQCm6VOuAl+BTnbrHV4uLC5ja2s01AQpoD4U8ftpqFs/fsXeOKNf5dBmREr+6iZ1iC0WjbUtdCQvxSyD99HObGTBAze2bs5x2H95nHkvqSKu3f3bqmttZY96zlagxn5qBftPQQBmT9Stm9w/QGSFj3LmLzZAtIxd1SCO3eFaYMD4JzBfvh6WMtPKvBoDlxAKaGBkPS2lXmva4FbgPCpi6l8oxGmxA8VFFAQrt1hpfPH9oEUveaQvKyD8Gg/67Ve4+F+zB+UGCTpyAB73UPDIGE2hpKtzkHbQdIdvIqRQHRVtj2EHtWeHQfzJs8oRHILfcAoeRbqb1DBDJsSDMgeZuTID8r0abxJ3e0qsy2xBXzGBLp5wuvXlZB3uZU2J62FvbmZDgNhDVhbCjfbcP0iGqHugNGIxCWnDVWbG56HNS/2GPXTK8uuMVDRvftA7uy0u3GEWvGfm/fjkwI69EV5k2dBLlfHzBKD6Qhz3APkCDXgNS/2AOa49skB8J6S1tTklyCwZ8+AntyMqCm+oEYX47vz2PxpD7cp2eipEDcuUGGAcnZkOQSkNz0OLd4iKux48vMtFavMTDR/fyfhXR+R7pVKm1dLXJeVw5J61bDxKAhoitPDg2B5LRkOK+rkAwIL1EMaQsQa3b68B6I8utzSTIgbdnLd46UQ+yYKIibNR1uX0Xw/KkO7lwvhvi5M2D2xHEwfsigDuMhJitGH/4Pwrp1kW7KFwmYuApkzfokEUbLQhpfCyKUCL/ekLNxTYcG8uTxA5ZwSgrkoqtAWDN1+xqyWNC7ty6KTVhHB3KuYD+M9u99UTIgbH2VowA0jyphxYoEiAzwE0dG2WoSW5lvzNBBsE0CILxCYwjL3CcM6v8suPM7YZIBYetYHQWycmUixM2eLs6DP8J3YP+OLDDWGawDCZIGiElhHsKSQ+YZEwcHPh/l22sdJ6UA4Ie2ur4Ft6/CorkzxeyUNUF63T2HCx4zdCDkuJiH5LoBCJuMsrWYLqRLJ7h2sVAs+87MNOuL7nx6isMn2Xvz7rFBWU5qFVM8zBqM6MAAyM/+FKrIXXj9ilqtfJYw1Rgqm9konx4QOzJUMUAiJJjCtWCLOHcICSSt5Ycxz9i1Jd0hb4jo42PxaZodOaKpUvI2r4H8rOUOGbtW6hjiHiD4iUav/5V7FlBTcsj8w1gzxTzDESCRfXxh56YE+O7G3iZbOj0a4maMl/RJNynPQ4A3kEmSA2mEYj625QyQKD9fuF6yvVmzs3xuJMTFhnd8IIKbty+8GQG+vHB2LHyZleYYEP/ecL14W7sAyXNgGL/R2LXuBtIu2xdY7ys1O31ShH/v2rzM1Hp7nhId4AfX+BybQHgJYoGrnQO3AhFwDddeCuny9h8j/Hy+Du3W5aWtLiPrEtsDYpLIlAaEBXZOLrETdCwVKjLAH66irV4KhNyWEQjRWioU2wRztSjbK4EgAe+TDcibLc+tgQQGQKkm2ztjCCWT5QSSZalQ0QP6w7eaLd7nIZRUn6ku/42cQCZbBhLolUCQgJfIBqMBSOUfLK3hGjOwP1w5n9WsMhJnhUP8zKgODASXKOKEU57isy0LN27wALhc2ADE9Hw3/PfyRhgT4APZn8yRPIagb/Kg/uVRWYGw/ZYa/f3fc0qQpWaLLWgoPpkhVkL+5gVibjJz5ACgD3ZL7iGmRqvTAn9ym0ODlNICwSWKgWF22PH9ljtu1y6JhfoX+6CabIebJSlgerYb6l8ecx8Qo+PGFluwjkdbAziLGYo8Ux5R/E/zwn5+aJ84pbvk/Wg48Z8UuFyYDaWaHNAUZEm6vSDfBduZkQJRffvAx4s+sFPhuJDlFOz4KPEUo4Yk+DYbPGQbPmXtTTk404jMbyj/VAEsXjgPYsJCJDlGI1wii+rnL54ocaaizEZMwI/ZkbWcJ4ttfmQDa1J3Jfl2NtZrRIIumusIQoJujFynAiGKTUjA299sV3b5b/AGMofrSEKULJQJyDz2+cUGXZhLnkpJNU9JFNcRxaC0l6cg5hkUzzf/fP7hw9/xFGe++UoKOyCYR+HPLwjaP3EdWaz5YnMDboUh4BqekkhrZWD5AW8gsxHFR8SvRWroKb1giRx7rVggH7LRBs5bxL6Xgx1t5B7PIOeLq3V/lfsePU7iqXNU+75kx8FSXFEk4PGKPbvKU8Qy+mI9iUECPu30Sdbs29cEfIp1R92yOtDbdamq6i22fulN4GWDk1qWjH3f28EVSMBneIF8igx4YkmN9rdyl1mVKlWqVKlSpUqVKlWqVKlSpUqVKlWqVKniWun/1l3OBiw/ZcIAAAAASUVORK5CYII="/>                </span>
     ),
  },
  {
    label: "Work",
    href: "/client/work",
    bg: "bg-red-600",
    icon: (
      <i className="bi bi-facebook text-4xl font-bold text-white" />
    ),
  },
  {
    label: "About Us",
    href: "/client/about",
    bg: "bg-orange-500",
    icon: (
      <span>
<img src="data:image/png;base64,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"/>                </span>

     ),
  },
  {
    label: "Contact Us",
    href: "/client/contact",
    bg: "bg-orange-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
        <path d="M22 10H42V28H28L22 34V28H22V10Z" fill="#0071C5" />
        <circle cx="16" cy="18" r="7" fill="#33B5E5" />
        <path d="M26 40C26 34.4772 21.5228 30 16 30C10.4772 30 6 34.4772 6 40V42H26V40Z" fill="#33B5E5" />
      </svg>
    ),
  },
  {
    label: "Wallet",
    href: "/client/wallet",
    bg: "bg-orange-500",
    icon: (
      <svg className="h-12 w-12 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 5C4 3.89543 4.89543 3 6 3H18C19.1046 3 20 3.89543 20 5V7H4V5Z" fill="currentColor" fillOpacity="0.2"/>
        <path d="M20 7H4V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M4 7H18C19.1046 7 20 7.89543 20 9V12C20 13.1046 19.1046 14 18 14H15C13.8954 14 13 13.1046 13 12V9C13 7.89543 13.8954 7 15 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="16.5" cy="10.5" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: "FBR",
    href: "/client/fbr",
    bg: "bg-orange-500",
    icon: (
      <span style={{ display: "block", fontSize: "2rem", fontWeight: "bold" }}>FBR</span>
    ),
  },
];

export default function ClientDashboard() {
  const router = useRouter();
  const user = useClientUser();
  const [copied, setCopied] = useState(false);

  const handleLogout = async () => {
    try { await authApi.logout(); } finally { clearAccessToken(); router.push("/login"); }
  };

  const handleCopyReferLink = async () => {
    const link = `${window.location.origin}/login?ref=${user?.referralCode || user?.id || ""}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = link;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen w-full" style={{backgroundColor: "#001f3f"}}>
    <div className="relative mx-auto max-w-lg px-4 pt-2">
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

      {/* Orange Octagon */}
      <div className="flex justify-center">
        <div
          className="flex w-96 flex-col items-center justify-center bg-orange-500 px-12 py-16 sm:w-105"
          style={{
            clipPath:
              "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
          }}
        >
          {/* Fanta logo */}
          <div className="mb-3 flex h-28 w-28 items-center justify-center rounded-xl bg-white shadow-md">
            <img
              src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775666576/fatbabotle_lpufpb.png"
              alt="Fanta"
              className="h-24 w-auto object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-center text-white">
            Fanta Earn
          </h1>

          {/* Show Wallet */}
          <button
            onClick={() => router.push("/client/wallet")}
            className="mt-3 flex items-center justify-center gap-2 text-lg font-medium text-white underline underline-offset-4 transition hover:text-orange-200"
          >
            Show Wallet
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4.5C7.305 4.5 3.257 7.61 1.5 12c1.757 4.39 5.805 7.5 10.5 7.5s8.743-3.11 10.5-7.5C20.743 7.61 16.695 4.5 12 4.5zm0 12.5a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
          </button>

          {/* Copy Refer link */}
          <button
            onClick={handleCopyReferLink}
            className="mt-2 flex items-center justify-center gap-2 transition hover:text-orange-200"
          >
            <p className="flex items-center justify-center gap-2 text-lg font-medium text-white">
              {copied ? "Copied!" : "Copy Refer link"}
            </p>
            <svg className="h-6 w-6 text-white font-bold cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {copied ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Notice Bar */}
      <div className="mt-6 flex items-center overflow-hidden rounded-lg bg-orange-500">
        <div className="flex h-10 w-12 shrink-0 items-center justify-center bg-blue-600">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="overflow-hidden px-4 py-2">
          <p className="animate-marquee whitespace-nowrap text-sm font-medium text-white">
            Your Notice For Dashboard &mdash; Welcome to Fanta Earn! Complete your tasks daily to maximize earnings.
          </p>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
        {actionCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`flex flex-col items-center justify-center rounded-xl ${card.bg} border-2 border-orange-600/40 px-2 py-5 shadow-md transition-transform hover:scale-105 active:scale-95 sm:py-6`}
          >
            {card.icon}
            <p className="mt-2 text-center text-xs font-bold leading-tight text-white sm:text-sm">
              {card.label.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < card.label.split("\n").length - 1 && <br />}
                </span>
              ))}
            </p>
          </Link>
        ))}
      </div>

      {/* Marquee animation style */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
    </div>
  );
}
