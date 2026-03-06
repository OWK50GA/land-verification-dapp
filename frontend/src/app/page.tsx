"use client";
import Link from "next/link";
import { useTotalLands } from "@/hooks/useRead";

export default function Home() {
  const { total, isLoading } = useTotalLands();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative border-b border-zinc-800 bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 via-zinc-950 to-zinc-950 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-900/60 bg-amber-950/40 text-amber-400 text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live on Starknet Sepolia
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-50 leading-tight tracking-tight mb-6">
              Verify land ownership
              <br />
              <span className="text-amber-500">before you pay.</span>
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-xl">
              Terratrust is a decentralized land registry built on Starknet that
              prevents fraud, double-selling, and document forgery by recording
              immutable ownership history on-chain.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="btn-primary px-6 py-3 text-base font-semibold"
              >
                Register Land
              </Link>
              <Link
                href="/verify"
                className="btn-secondary px-6 py-3 text-base font-semibold"
              >
                Verify Ownership
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-zinc-800/60">
              <div>
                <p className="text-2xl font-bold text-zinc-100">
                  {isLoading ? "…" : String(total)}
                </p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">
                  Parcels Registered
                </p>
              </div>
              <div className="w-px bg-zinc-800" />
              <div>
                <p className="text-2xl font-bold text-zinc-100">Starknet</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">
                  Blockchain
                </p>
              </div>
              <div className="w-px bg-zinc-800" />
              <div>
                <p className="text-2xl font-bold text-zinc-100">IPFS</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">
                  Document Storage
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="border-b border-zinc-800 bg-zinc-900/40">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900">
              <div className="w-9 h-9 rounded-lg bg-amber-900/40 border border-amber-800/40 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-100">
                  Powered by Starknet
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  ZK-proof security and low fees
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900">
              <div className="w-9 h-9 rounded-lg bg-blue-900/40 border border-blue-800/40 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-100">
                  IPFS-secured Documents
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Legal deeds stored permanently
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900">
              <div className="w-9 h-9 rounded-lg bg-emerald-900/40 border border-emerald-800/40 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-100">
                  Immutable Ownership History
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Every transfer recorded forever
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">
            Everything you need
          </h2>
          <p className="text-zinc-500 text-sm">
            Full land lifecycle management on-chain
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              href: "/register",
              icon: "⊞",
              title: "Register Land",
              desc: "Record a parcel on-chain. Mints an NFT to your wallet with your legal doc stored on IPFS.",
            },
            {
              href: "/transfer",
              icon: "→",
              title: "Transfer",
              desc: "Transfer a parcel NFT to any Starknet address. Full ownership history recorded.",
            },
            {
              href: "/verify",
              icon: "◎",
              title: "Verify",
              desc: "Look up any land by ID. See owner history, documents, area, valuation and status.",
            },
            {
              href: "/my-lands",
              icon: "☰",
              title: "My Lands",
              desc: "View all parcels in your wallet. Update documents or initiate transfers.",
            },
          ].map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="card p-5 hover:border-zinc-700 transition-colors group"
            >
              <div className="text-xl text-amber-600 mb-3 group-hover:text-amber-500 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-semibold text-zinc-100 mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
