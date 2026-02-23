import { shortString, num } from "starknet";
import type { Encumbrance, LandPurpose, Land, TransferHistoryEntry } from "@/types";

export function felt252ToString(felt: bigint): string {
  try {
    return shortString.decodeShortString(num.toHex(felt));
  } catch {
    return String(felt);
  }
}

export function stringToFelt252(str: string): string {
  return shortString.encodeShortString(str);
}

export function parseEncumbrance(raw: any): Encumbrance {
  if (typeof raw === "object" && raw !== null) {
    const key = Object.keys(raw)[0];
    if (key) return key.toUpperCase() as Encumbrance;
  }
  return "NONE";
}

export function parsePurpose(raw: any): LandPurpose {
  if (typeof raw === "object" && raw !== null) {
    const key = Object.keys(raw)[0];
    if (key) return key.toUpperCase() as LandPurpose;
  }
  return "NONE";
}

export function parseLand(raw: any): Land {
  return {
    land_id: BigInt(raw.land_id ?? 0),
    parcel_number: felt252ToString(BigInt(raw.parcel_number ?? 0)),
    gps_coordinate: felt252ToString(BigInt(raw.gps_coordinate ?? 0)),
    area_square_meters: BigInt(raw.area_square_meters ?? 0),
    current_valuation: BigInt(raw.current_valuation ?? 0),
    purpose: parsePurpose(raw.purpose),
    encumbrance: parseEncumbrance(raw.encumberance),
  };
}

export function parseHistory(raw: any[]): TransferHistoryEntry[] {
  return raw.map((e) =>
    Array.isArray(e)
      ? { owner: e[0], timestamp: BigInt(e[1] ?? 0) }
      : { owner: e.owner, timestamp: BigInt(e.timestamp ?? 0) }
  );
}

export function shortAddr(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function fmtTimestamp(ts: bigint): string {
  if (!ts) return "—";
  return new Date(Number(ts) * 1000).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function fmtUSD(val: bigint): string {
  return "$" + Number(val).toLocaleString();
}

export function fmtArea(val: bigint): string {
  return Number(val).toLocaleString() + " m²";
}

export const ENCUMBRANCE_BADGE: Record<Encumbrance, string> = {
  NONE:     "bg-emerald-900/40 text-emerald-400 border-emerald-800",
  LIENS:    "bg-yellow-900/40 text-yellow-400 border-yellow-800",
  MORTGAGE: "bg-blue-900/40 text-blue-400 border-blue-800",
  DISPUTE:  "bg-red-900/40 text-red-400 border-red-800",
};

export const ENCUMBRANCE_LABEL: Record<Encumbrance, string> = {
  NONE: "Clear", LIENS: "Liens", MORTGAGE: "Mortgage", DISPUTE: "In Dispute",
};

export const PURPOSE_LABEL: Record<LandPurpose, string> = {
  NONE: "Unclassified", RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial", AGRICULTURAL: "Agricultural",
};
