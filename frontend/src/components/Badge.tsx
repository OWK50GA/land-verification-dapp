import clsx from "clsx";
import { ENCUMBRANCE_BADGE, ENCUMBRANCE_LABEL } from "@/lib/utils";
import type { Encumbrance } from "@/types";

export function Badge({ value }: { value: Encumbrance }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
        ENCUMBRANCE_BADGE[value],
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {ENCUMBRANCE_LABEL[value]}
    </span>
  );
}
