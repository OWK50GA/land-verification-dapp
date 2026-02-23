"use client";
import { useState } from "react";
import { useContract, useSendTransaction } from "@starknet-react/core";
import { CONTRACT_ADDRESS, LAND_REGISTRY_ABI } from "@/lib/contract";
import { stringToFelt252 } from "@/lib/utils";
import type { TxStatus } from "@/types";

export function useWrite() {
  const [status, setStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const { contract } = useContract({ abi: LAND_REGISTRY_ABI, address: CONTRACT_ADDRESS });
  const { sendAsync } = useSendTransaction({});

  const reset = () => { setStatus("idle"); setTxHash(null); setErrMsg(null); };

  async function sendCall(call: object) {
    setStatus("pending"); setErrMsg(null);
    try {
      const res = await sendAsync([call as any]);
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

  const registerLand = async (p: {
    parcel_number: string;
    gps_coordinate: string;
    area_square_meters: bigint;
    legal_doc_hash: string;
    current_valuation: bigint;
    encumbrance: string;
    purpose: string;
  }) => {
    if (!contract) throw new Error("Contract not ready");
    const call = contract.populate("register_land", [
      stringToFelt252(p.parcel_number),
      stringToFelt252(p.gps_coordinate),
      p.area_square_meters,
      p.legal_doc_hash,
      p.current_valuation,
      { [p.encumbrance]: {} },
      { [p.purpose]: {} },
    ]);
    return sendCall(call);
  };

  const transferLand = async (recipient: string, land_id: bigint) => {
    if (!contract) throw new Error("Contract not ready");
    const call = contract.populate("transfer_land", [recipient, land_id]);
    return sendCall(call);
  };

  const updateDocument = async (land_id: bigint, new_hash: string) => {
    if (!contract) throw new Error("Contract not ready");
    const call = contract.populate("update_document", [new_hash, land_id]);
    return sendCall(call);
  };

  const flagDispute = async (land_id: bigint) => {
    if (!contract) throw new Error("Contract not ready");
    const call = contract.populate("flag_dispute", [land_id]);
    return sendCall(call);
  };

  const resolveDispute = async (land_id: bigint) => {
    if (!contract) throw new Error("Contract not ready");
    const call = contract.populate("resolve_dispute", [land_id]);
    return sendCall(call);
  };

  return { registerLand, transferLand, updateDocument, flagDispute, resolveDispute, status, txHash, errMsg, reset };
}
