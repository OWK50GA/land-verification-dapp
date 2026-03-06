"use client";
import { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { useWrite } from "@/hooks/useWrite";
import { useLand } from "@/hooks/useRead";
import { LandCard } from "@/components/LandCard";
import { TxFeedback } from "@/components/TxStatus";
import { ENCUMBRANCE_LABEL } from "@/lib/utils";

export default function AdminPage() {
  const { isConnected } = useAccount();
  const [input, setInput] = useState("");
  const [id, setId] = useState("");
  const { land, isLoading } = useLand(id);
  const { flagDispute, resolveDispute, status, txHash, errMsg, reset } =
    useWrite();
  const exists = land && land.land_id > 0n;

  if (!isConnected)
    return (
      <div className="page max-w-2xl">
        <h1 className="text-3xl font-bold text-zinc-50 mb-2">Admin Panel</h1>
        <div className="card p-8 text-center mt-6">
          <p className="text-zinc-400">
            Connect the contract owner wallet to continue.
          </p>
        </div>
      </div>
    );

  return (
    <div className="page max-w-2xl">
      <h1 className="text-3xl font-bold text-zinc-50 mb-2">Admin Panel</h1>
      <p className="text-zinc-400 mb-6">
        Owner-only dispute management. Calls from non-owner wallets will revert.
      </p>

      <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-4 mb-6">
        <p className="text-sm font-semibold text-amber-400">
          ⚠ Contract Owner Only
        </p>
        <p className="text-xs text-amber-700 mt-0.5">
          These functions — flag_dispute and resolve_dispute — require the
          deployer wallet.
        </p>
      </div>

      <div className="card">
        <div className="px-5 py-4 border-b border-zinc-800">
          <span className="label">Dispute Management</span>
        </div>
        <div className="p-5 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setId(input.trim());
            }}
            className="flex gap-3"
          >
            <input
              className="input flex-1"
              type="number"
              min="1"
              placeholder="Enter land ID"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn-secondary">
              Load
            </button>
          </form>

          {isLoading && (
            <div className="h-40 rounded-xl bg-zinc-800 animate-pulse" />
          )}

          {!isLoading && id && !exists && (
            <p className="text-zinc-500 text-sm text-center py-3">
              Land #{id} not found.
            </p>
          )}

          {!isLoading && exists && (
            <div className="space-y-4">
              <LandCard land={land} />

              <div className="rounded-lg bg-zinc-950 border border-zinc-800 px-4 py-3">
                <span className="label">Current Status</span>
                <p className="text-sm font-semibold text-zinc-200 mt-1">
                  {ENCUMBRANCE_LABEL[land.encumbrance]}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500">
                    Calls flag_dispute(land_id) — sets encumbrance to DISPUTE,
                    blocking all transfers and edits.
                  </p>
                  <button
                    onClick={() => flagDispute(land.land_id)}
                    className="btn-danger w-full"
                    disabled={
                      status === "pending" || land.encumbrance === "DISPUTE"
                    }
                  >
                    {land.encumbrance === "DISPUTE"
                      ? "Already Disputed"
                      : "Flag Dispute"}
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500">
                    Calls resolve_dispute(land_id) — clears the DISPUTE
                    encumbrance, restoring normal status.
                  </p>
                  <button
                    onClick={() => resolveDispute(land.land_id)}
                    className="btn-secondary w-full"
                    disabled={
                      status === "pending" || land.encumbrance !== "DISPUTE"
                    }
                  >
                    Resolve Dispute
                  </button>
                </div>
              </div>

              {status === "success" && (
                <div className="rounded-lg border border-emerald-800 bg-emerald-950 p-4">
                  <p className="text-sm text-emerald-400 font-medium">✓ Done</p>
                  {txHash && (
                    <a
                      href={`https://sepolia.starkscan.co/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-500 underline mt-1 block"
                    >
                      View transaction →
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <TxFeedback
        status={status}
        txHash={txHash}
        errMsg={errMsg}
        onClose={reset}
      />
    </div>
  );
}
