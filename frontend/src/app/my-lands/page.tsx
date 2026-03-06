"use client";
import { useAccount } from "@starknet-react/core";
import { useUserLands, useLand, useTokenUri } from "@/hooks/useRead";
import { useWrite } from "@/hooks/useWrite";
import { LandCard } from "@/components/LandCard";
import { TxFeedback } from "@/components/TxStatus";
import { useState } from "react";
import Link from "next/link";

function LandRow({ id }: { id: bigint }) {
  const { land, isLoading } = useLand(String(id));
  const { uri } = useTokenUri(String(id));
  const { updateDocument, status, txHash, errMsg, reset } = useWrite();
  const [editing, setEditing] = useState(false);
  const [newHash, setNewHash] = useState("");

  if (isLoading)
    return <div className="h-52 rounded-xl bg-zinc-800 animate-pulse" />;
  if (!land || land.land_id === 0n) return null;

  const canEdit = land.encumbrance === "NONE";

  return (
    <div>
      <LandCard land={land} uri={uri} actions />
      {canEdit && (
        <div className="mt-2">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-zinc-500 hover:text-zinc-300 underline"
            >
              Update document
            </button>
          ) : (
            <div className="mt-2 card p-4 space-y-3">
              <p className="text-xs text-zinc-400 font-medium">
                Update IPFS document for Land #{String(land.land_id)}
              </p>
              <input
                className="input"
                placeholder="New IPFS CID (Qm... or bafybei...)"
                value={newHash}
                onChange={(e) => setNewHash(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    if (!newHash.trim()) return;
                    try {
                      await updateDocument(land.land_id, newHash);
                      setEditing(false);
                      setNewHash("");
                    } catch {}
                  }}
                  className="btn-primary text-xs py-1.5"
                  disabled={status === "pending"}
                >
                  {status === "pending" ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    reset();
                  }}
                  className="btn-secondary text-xs py-1.5"
                >
                  Cancel
                </button>
              </div>
              {status === "success" && (
                <p className="text-xs text-emerald-400">✓ Document updated!</p>
              )}
              {status === "error" && (
                <p className="text-xs text-red-400">{errMsg}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyLandsPage() {
  const { address, isConnected } = useAccount();
  const { landIds, isLoading } = useUserLands(address);

  if (!isConnected)
    return (
      <div className="page max-w-5xl">
        <h1 className="text-3xl font-bold text-zinc-50 mb-2">My Lands</h1>
        <div className="card p-8 text-center mt-6">
          <p className="text-zinc-400">
            Connect your wallet to view your parcels.
          </p>
        </div>
      </div>
    );

  return (
    <div className="page max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-50">My Lands</h1>
          <p className="text-zinc-400 mt-1">
            All parcels owned by your connected wallet.
          </p>
        </div>
        <Link href="/register" className="btn-primary">
          + Register New
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-52 rounded-xl bg-zinc-800 animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && landIds.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-4xl mb-4">◇</p>
          <p className="text-zinc-400 font-medium mb-2">No Parcels Found</p>
          <p className="text-zinc-600 text-sm mb-6">
            You don&apos;t own any registered land parcels yet.
          </p>
          <Link href="/register" className="btn-primary">
            Register Your First Parcel
          </Link>
        </div>
      )}

      {!isLoading && landIds.length > 0 && (
        <>
          <p className="text-sm text-zinc-500 mb-4">
            <span className="text-zinc-200 font-medium">{landIds.length}</span>{" "}
            parcel{landIds.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {landIds.map((id) => (
              <LandRow key={String(id)} id={id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
