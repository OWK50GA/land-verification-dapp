import Link from "next/link";
import clsx from "clsx";
import type { Land } from "@/types";
import { Badge } from "./Badge";
import { fmtUSD, fmtArea, PURPOSE_LABEL } from "@/lib/utils";

export function LandCard({
  land, uri, actions,
}: {
  land: Land; uri?: string; actions?: boolean;
}) {
  return (
    <div className={clsx("rounded-xl border bg-zinc-900 transition-colors", land.encumbrance === "DISPUTE" ? "border-red-800" : "border-zinc-800 hover:border-zinc-700")}>
      <div className="px-5 pt-5 pb-4 border-b border-zinc-800 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">{PURPOSE_LABEL[land.purpose]}</p>
          <h3 className="text-base font-semibold text-zinc-100 truncate">Parcel #{land.parcel_number || String(land.land_id)}</h3>
          <p className="text-xs text-zinc-600 font-mono mt-0.5">ID: {String(land.land_id)}</p>
        </div>
        <Badge value={land.encumbrance} />
      </div>

      <div className="px-5 py-4 grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
        <div>
          <p className="text-xs text-zinc-500 mb-0.5">Valuation</p>
          <p className="font-medium text-zinc-200">{fmtUSD(land.current_valuation)}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-0.5">Area</p>
          <p className="font-medium text-zinc-200">{fmtArea(land.area_square_meters)}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-zinc-500 mb-0.5">GPS</p>
          <p className="font-mono text-zinc-300 text-xs truncate">{land.gps_coordinate || "—"}</p>
        </div>
        {uri && (
          <div className="col-span-2">
            <p className="text-xs text-zinc-500 mb-0.5">Document (IPFS)</p>
            <a href={`https://ipfs.io/ipfs/${uri}`} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-500 underline font-mono truncate block hover:text-amber-400">
              {uri.slice(0, 36)}…
            </a>
          </div>
        )}
      </div>

      {actions && (
        <div className="px-5 pb-4 flex gap-2 border-t border-zinc-800 pt-4">
          <Link href={`/verify?id=${land.land_id}`} className="text-xs px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors">
            View Details
          </Link>
          {land.encumbrance === "NONE" && (
            <Link href={`/transfer?id=${land.land_id}`} className="text-xs px-3 py-1.5 rounded-md bg-amber-900/50 hover:bg-amber-800/50 text-amber-300 transition-colors">
              Transfer
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
