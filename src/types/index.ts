export type Encumbrance = "NONE" | "LIENS" | "MORTGAGE" | "DISPUTE";
export type LandPurpose = "NONE" | "RESIDENTIAL" | "COMMERCIAL" | "AGRICULTURAL";

export interface Land {
  land_id: bigint;
  parcel_number: string;
  gps_coordinate: string;
  area_square_meters: bigint;
  current_valuation: bigint;
  purpose: LandPurpose;
  encumbrance: Encumbrance;
}

export interface TransferHistoryEntry {
  owner: string;
  timestamp: bigint;
}

export type TxStatus = "idle" | "pending" | "success" | "error";
