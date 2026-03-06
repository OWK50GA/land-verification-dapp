"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLand, useHistory, useTokenUri } from "@/hooks/useRead";
import { LandCard } from "@/components/LandCard";
import { OwnershipTimeline } from "@/components/OwnershipTimeline";
import { PURPOSE_LABEL, fmtUSD, fmtArea } from "@/lib/utils";
import { useReadContract } from "@starknet-react/core";
import { CONTRACT_ADDRESS, LAND_REGISTRY_ABI } from "@/lib/contract";

function Content() {
  const params = useSearchParams();
  const [input, setInput] = useState(params.get("id") ?? "");
  const [id, setId] = useState(params.get("id") ?? "");

  const { land, isLoading } = useLand(id);
  const { history, isLoading: hLoading } = useHistory(id);
  const { uri } = useTokenUri(id);
  const exists = land && land.land_id > 0n;

  useEffect(() => {
    const v = params.get("id");
    if (v) {
      setInput(v);
      setId(v);
    }
  }, [params]);

  return (
    <div className="page max-w-3xl">
      <h1 className="text-3xl font-bold text-zinc-50 mb-2">Verify Land</h1>
      <p className="text-zinc-400 mb-8">
        Enter a land ID to view its full on-chain record.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setId(input.trim());
        }}
        className="flex gap-3 mb-8"
      >
        <input
          className="input flex-1"
          type="number"
          min="1"
          placeholder="Enter land ID (e.g. 1)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Loading…" : "Verify"}
        </button>
      </form>

      {isLoading && (
        <div className="space-y-4">
          <div className="h-44 rounded-xl bg-zinc-800 animate-pulse" />
          <div className="h-28 rounded-xl bg-zinc-800 animate-pulse" />
        </div>
      )}

      {!isLoading && id && !exists && (
        <div className="card p-8 text-center">
          <p className="text-zinc-400 font-medium">
            No land found with ID {id}
          </p>
        </div>
      )}

      {!isLoading && exists && (
        <div className="space-y-5 animate-slide-up">
          <LandCard land={land} uri={uri} />

          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-800">
              <span className="label">Full Record</span>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["Land ID", String(land.land_id)],
                ["Parcel Number", land.parcel_number],
                ["GPS Coordinate", land.gps_coordinate],
                ["Area", fmtArea(land.area_square_meters)],
                ["Valuation", fmtUSD(land.current_valuation)],
                ["Purpose", PURPOSE_LABEL[land.purpose]],
                ["Encumbrance", land.encumbrance],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-zinc-950 px-3 py-2.5">
                  <p className="label mb-1">{k}</p>
                  <p className="text-sm font-mono text-zinc-300 truncate">
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
              <span className="label">Ownership History</span>
              <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                {history.length} records
              </span>
            </div>
            <div className="p-5">
              <OwnershipTimeline history={history} loading={hLoading} />
            </div>
          </div>

          {uri && (
            <div className="card p-5">
              <span className="label block mb-3">Legal Document (IPFS)</span>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs font-mono text-zinc-300 truncate flex-1">
                  {uri}
                </p>
                <a
                  href={`https://ipfs.io/ipfs/${uri}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs px-3 py-1.5 shrink-0"
                >
                  Open →
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="page">
          <div className="h-64 bg-zinc-800 rounded-xl animate-pulse" />
        </div>
      }
    >
      <Content />
    </Suspense>
  );
}
