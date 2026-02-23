import type { TransferHistoryEntry } from "@/types";
import { shortAddr, fmtTimestamp } from "@/lib/utils";

export function OwnershipTimeline({ history, loading }: { history: TransferHistoryEntry[]; loading?: boolean }) {
  if (loading) return <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-10 rounded bg-zinc-800 animate-pulse" />)}</div>;
  if (!history.length) return <p className="text-zinc-600 text-sm py-2">No history found.</p>;

  return (
    <ol className="relative border-l border-zinc-800 ml-3">
      {history.map((e, i) => (
        <li key={i} className="ml-6 mb-5 last:mb-0">
          <div className={`absolute -left-1.5 w-3 h-3 rounded-full border-2 ${i === history.length - 1 ? "bg-emerald-500 border-emerald-400" : "bg-zinc-700 border-zinc-600"}`} />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-zinc-200">{shortAddr(e.owner)}</span>
            {i === 0 && <span className="text-xs bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded-full">First Owner</span>}
            {i === history.length - 1 && history.length > 1 && <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">Current Owner</span>}
          </div>
          <p className="text-xs text-zinc-600 mt-0.5">{fmtTimestamp(e.timestamp)}</p>
        </li>
      ))}
    </ol>
  );
}
