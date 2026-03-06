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
      <div className="max-w-6xl mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-amber-700 flex items-center justify-center shrink-0">
            <img
              src="/logo.png"
              alt="Terratrust"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="text-white font-bold text-sm absolute">T</span>
          </div>
          <span className="font-bold text-zinc-100 text-base tracking-tight hidden sm:block">
            Terratrust
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                path === l.href
                  ? "bg-amber-900/50 text-amber-300 font-medium"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Wallet + mobile toggle */}
        <div className="flex items-center gap-2">
          {isConnected && address ? (
            <div className="relative">
              <button
                onClick={() => setWOpen(!wOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-mono text-xs">{shortAddr(address)}</span>
              </button>
              {wOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl py-1 z-50">
                  <p className="px-3 py-2 text-xs text-zinc-500 border-b border-zinc-800 font-mono truncate">
                    {address}
                  </p>
                  <button
                    onClick={() => {
                      disconnect();
                      setWOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-zinc-800 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setWOpen(!wOpen)}
                className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold transition-colors"
              >
                Connect Wallet
              </button>
              {wOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl py-2 z-50">
                  <p className="px-3 pb-2 text-xs text-zinc-500 border-b border-zinc-800 mb-1 font-medium uppercase tracking-wider">
                    Select Wallet
                  </p>
                  {connectors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        connect({ connector: c });
                        setWOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-zinc-800 px-4 py-3 space-y-1 bg-zinc-950">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={clsx(
                "block px-3 py-2.5 rounded-md text-sm transition-colors",
                path === l.href
                  ? "bg-amber-900/50 text-amber-300 font-medium"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
