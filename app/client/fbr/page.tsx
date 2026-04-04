import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "FBR | Fanta Earn",
};

export default function FbrPage() {
  return (
    <div className="min-h-screen w-full bg-slate-900 text-white">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">FBR Certificate</h1>
          <Link
            href="/client/dashboard"
            className="rounded bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
          {/* Use next/image for optimization; intrinsic ratio wrapper for responsiveness */}
          <div className="relative w-full" style={{ paddingTop: "141%" }}>
            <Image
              src="https://res.cloudinary.com/dgmjg9zr4/image/upload/v1775295707/fbr_mdknyt.jpg"
              alt="FBR Taxpayer Registration Certificate"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-contain bg-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

