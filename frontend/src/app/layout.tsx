"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { StarknetProvider } from "@/lib/providers";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-zinc-200 antialiased`}>
        <StarknetProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-zinc-800 mt-16">
            <div className="max-w-6xl mx-auto px-4 py-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 2L4 7V15C4 21.627 9.373 27.627 16 30C22.627 27.627 28 21.627 28 15V7L16 2Z" fill="url(#footerShieldGrad)" />
                      <path d="M16 6L8 10V15C8 19.8 11.6 24.2 16 26C20.4 24.2 24 19.8 24 15V10L16 6Z" fill="#1c1917" fillOpacity="0.35" />
                      <defs>
                        <linearGradient id="footerShieldGrad" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#f97316" />
                          <stop offset="1" stopColor="#b45309" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="font-bold text-zinc-100 text-lg">Terratrust</span>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Decentralized land verification on Starknet. Prevent fraud before you pay.
                  </p>
                </div>

                <div className="md:text-center">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3">Network</p>
                  <p className="text-sm text-zinc-400">Starknet Sepolia</p>
                  <p className="text-sm text-zinc-400 mt-1">Cairo Smart Contract</p>
                  <p className="text-sm text-zinc-400 mt-1">IPFS Document Storage</p>
                </div>

                <div className="md:text-right">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3">Community</p>
                  <div className="flex md:justify-end gap-4">
                    
                      href="https://x.com/TerraTrustHQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                    >
                      X
                    </a>
                    
                      href="https://discord.gg/gKbMKQtN"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                    >
                      Discord
                    </a>
                    
                      href="https://github.com/Terratrust"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-800 mt-8 pt-6 text-center">
                <p className="text-xs text-zinc-600">
                  © {new Date().getFullYear()} Terratrust. Built on Starknet. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </StarknetProvider>
      </body>
    </html>
  );
}
