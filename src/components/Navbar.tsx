"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { shortAddr } from "@/lib/utils";
import clsx from "clsx";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/verify", label: "Verify" },
  { href: "/register", label: "Register" },
  { href: "/transfer", label: "Transfer" },
  { href: "/my-lands", label: "My Lands" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [wOpen, setWOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/95 border-b border-zinc-800 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-amber-700 flex items-center justify-center text-xs font-bold text-white">L</div>
          <span className="font-semibold text-zinc-100 hidden sm:block">LandChain</span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} className={clsx("px-3 py-1.5 rounded text-sm transition-colors", path === l.href ? "bg-amber-900/50 text-amber-300" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800")}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isConnected && address ? (
            <div className="relative">
              <button onClick={() => setWOpen(!wOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded border border-zinc-700 bg-zinc-900 text-sm text-zinc-300 hover:bg-zinc-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-mono text-xs">{shortAddr(address)}</span>
              </button>
              {wOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl py-1 animate-fade-in">
                  <p className="px-3 py-1.5 text-xs text-zinc-500 border-b border-zinc-800 font-mono truncate">{address}</p>
                  <button onClick={() => { disconnect(); setWOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-zinc-800">Disconnect</button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <button onClick={() => setWOpen(!wOpen)} className="px-4 py-1.5 rounded bg-amber-700 hover:bg-amber-600 text-white text-sm font-medium">
                Connect
              </button>
              {wOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl py-2 animate-fade-in">
                  <p className="px-3 pb-1.5 text-xs text-zinc-500 border-b border-zinc-800 mb-1">Select wallet</p>
                  {connectors.map(c => (
                    <button key={c.id} onClick={() => { connect({ connector: c }); setWOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-zinc-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-zinc-800 px-4 py-2 space-y-0.5">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={clsx("block px-3 py-2 rounded text-sm", path === l.href ? "bg-amber-900/50 text-amber-300" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800")}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
