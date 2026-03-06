"use client";
import { useReadContract } from "@starknet-react/core";
import { CONTRACT_ADDRESS, LAND_REGISTRY_ABI } from "@/lib/contract";
import { parseLand, parseHistory } from "@/lib/utils";
import type { Land, TransferHistoryEntry } from "@/types";

export function useLand(id: string | undefined) {
  // console.log("useLand id: ", id);
  const ok = !!id && id !== "0";
  const { data, isLoading, error } = useReadContract({
    abi: LAND_REGISTRY_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_land",
    args: ok ? [BigInt(id!)] : undefined,
    enabled: ok,
  });
  return { land: data ? parseLand(data) : null, isLoading, error };
}

export function useTokenUri(id: string | undefined) {
  const ok = !!id && id !== "0";
  const { data, isLoading } = useReadContract({
    abi: LAND_REGISTRY_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "token_uri",
    args: ok ? [BigInt(id!)] : undefined,
    enabled: ok,
  });
  return { uri: data as string | undefined, isLoading };
}

export function useHistory(id: string | undefined) {
  const ok = !!id && id !== "0";
  const { data, isLoading } = useReadContract({
    abi: LAND_REGISTRY_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_transfer_history",
    args: ok ? [BigInt(id!)] : undefined,
    enabled: ok,
  });

  const history: TransferHistoryEntry[] = data
    ? parseHistory(data as any[])
    : [];
  return { history, isLoading };
}

export function useUserLands(address: string | undefined) {
  const ok = !!address && address.length > 10;
  const { data, isLoading } = useReadContract({
    abi: LAND_REGISTRY_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_user_lands",
    args: ok ? [address!] : undefined,
    enabled: ok,
  });
  return { landIds: (data as bigint[] | undefined) ?? [], isLoading };
}

export function useTotalLands() {
  const { data, isLoading } = useReadContract({
    abi: LAND_REGISTRY_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_total_lands",
    args: [],
    enabled: true,
  });
  return { total: data ? BigInt(data as any) : 0n, isLoading };
}
