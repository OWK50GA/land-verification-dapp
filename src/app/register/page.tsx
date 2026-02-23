"use client";
import { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { useWrite } from "@/hooks/useWrite";
import { TxFeedback } from "@/components/TxStatus";

const PURPOSES = ["NONE","RESIDENTIAL","COMMERCIAL","AGRICULTURAL"];
const ENCUMBRANCES = ["NONE","LIENS","MORTGAGE"];

export default function RegisterPage() {
  const { isConnected } = useAccount();
  const { registerLand, status, txHash, errMsg, reset } = useWrite();

  const [f, setF] = useState({
    parcel_number: "", gps_coordinate: "",
    area_square_meters: "", legal_doc_hash: "",
    current_valuation: "", encumbrance: "NONE", purpose: "NONE",
  });
  const [errs, setErrs] = useState<any>({});

  const set = (k: string, v: string) => { setF(p => ({...p, [k]: v})); setErrs((p: any) => ({...p, [k]: ""})); };

  const validate = () => {
    const e: any = {};
    if (!f.parcel_number.trim()) e.parcel_number = "Required";
    if (f.parcel_number.length > 31) e.parcel_number = "Max 31 chars";
    if (!f.gps_coordinate.trim()) e.gps_coordinate = "Required";
    if (f.gps_coordinate.length > 31) e.gps_coordinate = "Max 31 chars";
    if (!f.area_square_meters || Number(f.area_square_meters) <= 0) e.area_square_meters = "Must be positive";
    if (!f.legal_doc_hash.trim()) e.legal_doc_hash = "Required";
    if (f.current_valuation === "" || Number(f.current_valuation) < 0) e.current_valuation = "Required";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await registerLand({
        parcel_number: f.parcel_number,
        gps_coordinate: f.gps_coordinate,
        area_square_meters: BigInt(f.area_square_meters),
        legal_doc_hash: f.legal_doc_hash,
        current_valuation: BigInt(f.current_valuation),
        encumbrance: f.encumbrance,
        purpose: f.purpose,
      });
    } catch {}
  };

  if (!isConnected) return (
    <div className="page max-w-2xl">
      <h1 className="text-3xl font-bold text-zinc-50 mb-2">Register Land</h1>
      <div className="card p-8 text-center mt-6">
        <p className="text-zinc-400">Connect your wallet to register a land parcel.</p>
      </div>
    </div>
  );

  return (
    <div className="page max-w-2xl">
      <h1 className="text-3xl font-bold text-zinc-50 mb-2">Register Land</h1>
      <p className="text-zinc-400 mb-8">Fill in all details. An NFT will be minted to your wallet and your legal document stored on IPFS.</p>

      <form onSubmit={submit} className="space-y-6">
        <div className="card p-5 space-y-4">
          <span className="label">Parcel Identification</span>
          <div className="field">
            <label className="field-label">Parcel Number <span className="text-amber-500">*</span></label>
            <p className="text-xs text-zinc-500 mb-1">Official government parcel ID. Max 31 characters.</p>
            <input className="input" placeholder="e.g. PARCEL-001-NG" value={f.parcel_number} onChange={e => set("parcel_number", e.target.value)} />
            {errs.parcel_number && <p className="text-xs text-red-400">{errs.parcel_number}</p>}
          </div>
          <div className="field">
            <label className="field-label">GPS Coordinate <span className="text-amber-500">*</span></label>
            <p className="text-xs text-zinc-500 mb-1">Compact format, max 31 characters.</p>
            <input className="input" placeholder="e.g. 6.4541N3.3947E" value={f.gps_coordinate} onChange={e => set("gps_coordinate", e.target.value)} />
            {errs.gps_coordinate && <p className="text-xs text-red-400">{errs.gps_coordinate}</p>}
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <span className="label">Land Details</span>
          <div className="field">
            <label className="field-label">Area (square meters) <span className="text-amber-500">*</span></label>
            <input className="input" type="number" min="1" placeholder="e.g. 1500" value={f.area_square_meters} onChange={e => set("area_square_meters", e.target.value)} />
            {errs.area_square_meters && <p className="text-xs text-red-400">{errs.area_square_meters}</p>}
          </div>
          <div className="field">
            <label className="field-label">Current Valuation (USD) <span className="text-amber-500">*</span></label>
            <input className="input" type="number" min="0" placeholder="e.g. 250000" value={f.current_valuation} onChange={e => set("current_valuation", e.target.value)} />
            {errs.current_valuation && <p className="text-xs text-red-400">{errs.current_valuation}</p>}
          </div>
          <div className="field">
            <label className="field-label">Land Purpose</label>
            <select className="select" value={f.purpose} onChange={e => set("purpose", e.target.value)}>
              {PURPOSES.map(p => <option key={p} value={p} className="bg-zinc-900">{p}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="field-label">Encumbrance</label>
            <p className="text-xs text-zinc-500 mb-1">New parcels must use NONE. Encumbered land will be rejected by contract.</p>
            <select className="select" value={f.encumbrance} onChange={e => set("encumbrance", e.target.value)}>
              {ENCUMBRANCES.map(e => <option key={e} value={e} className="bg-zinc-900">{e}</option>)}
            </select>
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <span className="label">Legal Document</span>
          <div className="field">
            <label className="field-label">IPFS CID <span className="text-amber-500">*</span></label>
            <p className="text-xs text-zinc-500 mb-1">Upload your deed to <a href="https://web3.storage" target="_blank" rel="noopener noreferrer" className="text-amber-500 underline">web3.storage</a> or <a href="https://nft.storage" target="_blank" rel="noopener noreferrer" className="text-amber-500 underline">nft.storage</a> first, then paste the CID here.</p>
            <input className="input" placeholder="Qm... or bafybei..." value={f.legal_doc_hash} onChange={e => set("legal_doc_hash", e.target.value)} />
            {errs.legal_doc_hash && <p className="text-xs text-red-400">{errs.legal_doc_hash}</p>}
          </div>
        </div>

        <button type="submit" className="btn-primary w-full py-3 text-base" disabled={status === "pending"}>
          {status === "pending" ? (
            <span className="flex items-center gap-2 justify-center">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Registering…
            </span>
          ) : "Register Land Parcel"}
        </button>

        {status === "success" && (
          <div className="rounded-lg border border-emerald-800 bg-emerald-950 p-4">
            <p className="text-sm font-medium text-emerald-400">✓ Land registered successfully!</p>
            {txHash && <a href={`https://sepolia.starkscan.co/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-500 underline mt-1 block">View transaction →</a>}
          </div>
        )}
      </form>

      <TxFeedback status={status} txHash={txHash} errMsg={errMsg} onClose={reset} />
    </div>
  );
}
