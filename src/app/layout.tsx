import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StarknetProvider } from "@/lib/providers";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LandChain — Land Registry on Starknet",
  description: "Decentralized land registration, transfer, and verification on Starknet.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-zinc-200 antialiased`}>
        <StarknetProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-700 mt-12">
            LandChain · Starknet Sepolia · Cairo Smart Contract
          </footer>
        </StarknetProvider>
      </body>
    </html>
  );
}
