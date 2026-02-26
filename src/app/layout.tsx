import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StarknetProvider } from "@/lib/providers";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Terratrust | Decentralized Land Verification",
  description:
    "Terratrust is a decentralized land registry built on Starknet that prevents fraud, double-selling, and document forgery by recording immutable ownership history on-chain.",
};

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
                    <div className="w-7 h-7 rounded-lg bg-amber-700 flex items-center justify-center text-white font-bold text-sm">
                      T
                    </div>
                    <span className="font-bold text-zinc-100 text-lg">Terratrust</span>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Decentralized land verification on Starknet. Prevent fraud before you pay.
                  </p>
                </div>

                <div className="md:text-center">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3">
                    Network
                  </p>
                  <p className="text-sm text-zinc-400">Starknet Sepolia</p>
                  <p className="text-sm text-zinc-400 mt-1">Cairo Smart Contract</p>
                  <p className="text-sm text-zinc-400 mt-1">IPFS Document Storage</p>
                </div>

                <div className="md:text-right">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3">
                    Community
                  </p>
                  <div className="flex md:justify-end gap-4">
                    
                      href="https://x.com/Terratrust"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
                    >
                      X
                    </a>
                    
                      href="https://discord.gg/Terratrust"
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
