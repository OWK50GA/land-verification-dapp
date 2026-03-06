import type { TxStatus } from "@/types";

export function TxFeedback({
  status,
  txHash,
  errMsg,
  onClose,
}: {
  status: TxStatus;
  txHash?: string | null;
  errMsg?: string | null;
  onClose?: () => void;
}) {
  if (status === "idle") return null;

  const map = {
    pending: {
      bg: "bg-zinc-900 border-zinc-700",
      text: "Waiting for confirmation…",
      icon: "⏳",
    },
    success: {
      bg: "bg-emerald-950 border-emerald-800",
      text: "Transaction confirmed!",
      icon: "✓",
    },
    error: {
      bg: "bg-red-950 border-red-800",
      text: errMsg ?? "Transaction failed.",
      icon: "✕",
    },
  };

  const c = map[status];

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-sm w-full rounded-xl border p-4 shadow-2xl ${c.bg}`}
    >
      <div className="flex gap-3 items-start">
        <span className="text-lg">{c.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-zinc-100">{c.text}</p>
          {txHash && status === "success" && (
            <a
              href={`https://sepolia.voyager.online/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-500 underline mt-1 block"
            >
              View on Voyager →
            </a>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 text-xs"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
