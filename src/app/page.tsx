"use client";
import Link from "next/link";
import { useTotalLands } from "@/hooks/useRead";

export default function Home() {
  const { total, isLoading } = useTotalLands();

  return (
    <div className="page">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-900/50 bg-amber-950/30 text-amber-500 text-xs mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live on Starknet Sepolia
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4 leading-tight">
          Land Registry<br /><span className="text-amber-500">on-chain.</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mb-8">
          Register parcels, transfer ownership, and verify land provenance — all on Starknet with zero intermediaries.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/register" className="btn-primary px-5 py-2.5 text-base">Register Land</Link>
          <Link href="/verify" className="btn-secondary px-5 py-2.5 text-base">Verify Ownership</Link>
        </div>
        <div className="flex gap-8 mt-10 text-sm">
          <div>
            <p className="text-2xl font-bold text-zinc-100">{isLoading ? "…" : String(total)}</p>
            <p className="text-zinc-500 text-xs uppercase tracking-wider mt-0.5">Parcels Registered</p>
          </div>
          <div className="w-px bg-zinc-800" />
          <div>
            <p className="text-2xl font-bold text-zinc-100">Sepolia</p>
            <p className="text-zinc-500 text-xs uppercase tracking-wider mt-0.5">Network</p>
          </div>
          <div className="w-px bg-zinc-800" />
          <div>
            <p className="text-2xl font-bold text-zinc-100">Cairo</p>
            <p className="text-zinc-500 text-xs uppercase tracking-wider mt-0.5">Contract Language</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: "/register", icon: "⊞", title: "Register Land", desc: "Record a parcel on-chain. Mints an NFT to your wallet with your legal doc stored on IPFS." },
          { href: "/transfer", icon: "→", title: "Transfer", desc: "Transfer a parcel NFT to any Starknet address. Full ownership history recorded." },
          { href: "/verify", icon: "◎", title: "Verify", desc: "Look up any land by ID. See owner history, documents, area, valuation and status." },
          { href: "/my-lands", icon: "☰", title: "My Lands", desc: "View all parcels in your wallet. Update documents or initiate transfers." },
        ].map(f => (
          <Link key={f.href} href={f.href} className="card p-5 hover:border-zinc-700 transition-colors group">
            <div className="text-xl text-amber-600 mb-3 group-hover:text-amber-500 transition-colors">{f.icon}</div>
            <h3 className="font-semibold text-zinc-100 mb-2">{f.title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
