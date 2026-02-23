"use client";
import { useState } from "react";
import { useContract, useSendTransaction } from "@starknet-react/core";
import { CONTRACT_ADDRESS, LAND_REGISTRY_ABI } from "@/lib/contract";
import { stringToFelt252 } from "@/lib/utils";
import type { TxStatus } from "@/types";

type FunctionName =
  | "register_land"
  | "transfer_land"
  | "update_document"
  | "flag_dispute"
  | "resolve_dispute";

export function useWrite() {
  const [status, setStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const { contract } = useContract({ abi: LAND_REGISTRY_ABI, address: CONTRACT_ADDRESS });
  const { sendAsync } = useSendTransaction({});

  const reset = () => { setStatus("idle"); setTxHash(null); setErrMsg(null); };

  async function send(name: FunctionName, args: unknown[]) {
    if (!contract) throw new Error("Contract not ready");
    setStatus("pending"); setErrMsg(null);
    try {
      const call = contract.populate(name, args);
      const res = await sendAsync([call]);
      setTxHash(res.transaction_hash);
      setStatus("success");
      return res;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed";
      setErrMsg(msg);
      setStatus("error");
      throw e;
    }
  }

  const registerLand = (p: {
    parcel_number: string;
    gps_coordinate: string;
    area_square_meters: bigint;
    legal_doc_hash: string;
    current_valuation: bigint;
    encumbrance: string;
    purpose: string;
  }) =>
    send("register_land", [
      stringToFelt252(p.parcel_number),
      stringToFelt252(p.gps_coordinate),
      p.area_square_meters,
      p.legal_doc_hash,
      p.current_valuation,
      { [p.encumbrance]: {} },
      { [p.purpose]: {} },
    ]);

  const transferLand = (recipient: string, land_id: bigint) =>
    send("transfer_land", [recipient, land_id]);

  const updateDocument = (land_id: bigint, new_hash: string) =>
    send("update_document", [new_hash, land_id]);

  const flagDispute = (land_id: bigint) =>
    send("flag_dispute", [land_id]);

  const resolveDispute = (land_id: bigint) =>
    send("resolve_dispute", [land_id]);

  return { registerLand, transferLand, updateDocument, flagDispute, resolveDispute, status, txHash, errMsg, reset };
}
