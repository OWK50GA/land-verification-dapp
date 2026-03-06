"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount } from "@starknet-react/core";
import { useWrite } from "@/hooks/useWrite";
import { useLand, useUserLands } from "@/hooks/useRead";
import { LandCard } from "@/components/LandCard";
import { TxFeedback } from "@/components/TxStatus";
import { shortAddr } from "@/lib/utils";

function Content() {
  const params = useSearchParams();
  const { address, isConnected } = useAccount();
  const [landId, setLandId] = useState(params.get("id") ?? "");
  const [recipient, setRecipient] = useState("");
  const [errs, setErrs] = useState<any>({});

  const { land, isLoading } = useLand(landId);
  const { landIds } = useUserLands(address);
  const { transferLand, status, txHash, errMsg, reset } = useWrite();

  useEffect(() => {
    const v = params.get("id");
    if (v) setLandId(v);
  }, [params]);

  const exists = land && land.land_id > 0n;
  const canTransfer = exists && land.encumbrance === "NONE";

  const validate = () => {
    const e: any = {};
    if (!landId || Number(landId) <= 0) e.landId = "Enter a valid land ID";
    if (!recipient.trim()) e.recipient = "Required";
    else if (!recipient.startsWith("0x")) e.recipient = "Must start with 0x";
    else if (recipient.length < 50) e.recipient = "Address too short";
    if (recipient.toLowerCase() === address?.toLowerCase())
      e.recipient = "Cannot transfer to yourself";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await transferLand(recipient, BigInt(landId));
    } catch {}
  };

  if (!isConnected)
    return (
      <div className="page max-w-2xl">
        <h1 className="text-3xl font-bold text-zinc-50 mb-2">
          Transfer Ownership
        </h1>
        <div className="card p-8 text-center mt-6">
          <p className="text-zinc-400">Connect your wallet to transfer land.</p>
        </div>
      </div>
    );

  return (
    <div className="page max-w-2xl">
      <h1 className="text-3xl font-bold text-zinc-50 mb-2">
        Transfer Ownership
      </h1>
      <p className="text-zinc-400 mb-8">
        Transfer a land parcel NFT to another Starknet address.
      </p>

      {landIds.length > 0 && (
        <div className="card p-4 mb-6">
          <span className="label block mb-3">Your Parcels — tap to select</span>
          <div className="flex flex-wrap gap-2">
            {landIds.map((id) => (
              <button
                key={String(id)}
                onClick={() => setLandId(String(id))}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${landId === String(id) ? "bg-amber-700 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
              >
                #{String(id)}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">
        <div className="card p-5 space-y-4">
          <span className="label">Transfer Details</span>
          <div className="field">
            <label className="field-label">
              Land ID <span className="text-amber-500">*</span>
            </label>
            <input
              className="input"
              type="number"
              min="1"
              placeholder="e.g. 1"
              value={landId}
              onChange={(e) => {
                setLandId(e.target.value);
                setErrs((p: any) => ({ ...p, landId: "" }));
              }}
            />
            {errs.landId && (
              <p className="text-xs text-red-400">{errs.landId}</p>
            )}
          </div>
          <div className="field">
            <label className="field-label">
              Recipient Address <span className="text-amber-500">*</span>
            </label>
            <p className="text-xs text-zinc-500 mb-1">
              Full Starknet address (0x...) of the new owner.
            </p>
            <input
              className="input"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                setErrs((p: any) => ({ ...p, recipient: "" }));
              }}
            />
            {errs.recipient && (
              <p className="text-xs text-red-400">{errs.recipient}</p>
            )}
          </div>
        </div>

        {landId && isLoading && (
          <div className="h-36 rounded-xl bg-zinc-800 animate-pulse" />
        )}

        {landId && !isLoading && exists && (
          <div className="space-y-3">
            <LandCard land={land} />
            {!canTransfer && (
              <div className="rounded-lg border border-red-800 bg-red-950 p-4">
                <p className="text-sm text-red-400 font-medium">
                  ⚠ Cannot transfer
                </p>
                <p className="text-xs text-red-500 mt-1">
                  This land has encumbrance: <strong>{land.encumbrance}</strong>
                  . Must be resolved first.
                </p>
              </div>
            )}
            {recipient && canTransfer && (
              <div className="card p-4 text-xs space-y-2">
                <span className="label">Transfer Summary</span>
                <div className="flex justify-between">
                  <span className="text-zinc-500">From</span>
                  <span className="font-mono text-zinc-300">
                    {shortAddr(address ?? "")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">To</span>
                  <span className="font-mono text-zinc-300">
                    {shortAddr(recipient)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Parcel</span>
                  <span className="text-zinc-300">{land.parcel_number}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {landId && !isLoading && !exists && (
          <div className="card p-4 text-center">
            <p className="text-zinc-500 text-sm">Land #{landId} not found.</p>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full py-3 text-base"
          disabled={status === "pending" || (!!exists && !canTransfer)}
        >
          {status === "pending" ? (
            <span className="flex items-center gap-2 justify-center">
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Transferring…
            </span>
          ) : (
            "Transfer Ownership"
          )}
        </button>

        {status === "success" && (
          <div className="rounded-lg border border-emerald-800 bg-emerald-950 p-4">
            <p className="text-sm font-medium text-emerald-400">
              ✓ Transfer complete!
            </p>
            {txHash && (
              <a
                href={`https://sepolia.voyager.online/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-500 underline mt-1 block"
              >
                View transaction →
              </a>
            )}
          </div>
        )}
      </form>

      <TxFeedback
        status={status}
        txHash={txHash}
        errMsg={errMsg}
        onClose={reset}
      />
    </div>
  );
}

export default function TransferPage() {
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
