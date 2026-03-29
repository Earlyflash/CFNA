import type { SessionEntry } from "@prisma/client";
import { flowMilestonesDoneInSession } from "@/lib/turnProgress";

type Props = {
  entry: SessionEntry;
  /** Smaller dots for tight headers (default). */
  size?: "sm" | "md";
};

/**
 * Compact turn-flow milestones as circles (same codes as the main turn graphic), for session cards.
 */
export function SessionFlowMilestoneDots({ entry, size = "sm" }: Props) {
  const done = flowMilestonesDoneInSession(entry);
  if (!done.length) return null;

  const circle =
    size === "sm"
      ? "h-7 w-7 border-2 text-[8px] sm:h-8 sm:w-8 sm:text-[9px]"
      : "h-8 w-8 border-2 text-[9px] sm:h-9 sm:w-9 sm:text-[10px]";

  return (
    <div
      className="flex shrink-0 flex-col flex-nowrap items-end gap-1 pt-0.5"
      role="list"
      aria-label="Turn flow steps logged in this session"
    >
      {done.map((m) => (
        <div key={m.key} className="shrink-0" role="listitem">
          <div
            className={[
              "flex items-center justify-center rounded-full border-wwam-ink bg-wwam-ink font-mono font-bold leading-none text-wwam-cream shadow-sm",
              circle,
            ].join(" ")}
            title={m.label}
          >
            {m.short}
          </div>
        </div>
      ))}
    </div>
  );
}
