import type { AggregatedTurnProgress } from "@/lib/turnProgress";
import { turnCompletionRatio, isTurnComplete } from "@/lib/turnProgress";

export function PastTurnsStrip({ turns }: { turns: AggregatedTurnProgress[] }) {
  if (!turns.length) return null;
  return (
    <section className="rounded-2xl border border-sand-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-sand-900">Earlier game-turns</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {turns.map((t) => {
          const pct = Math.round(turnCompletionRatio(t) * 100);
          const done = isTurnComplete(t);
          return (
            <li
              key={t.gameTurn}
              className="flex items-center gap-2 rounded-lg border border-sand-200 bg-sand-50 px-3 py-2 text-sm"
            >
              <span className="font-mono font-medium text-sand-900">T{t.gameTurn}</span>
              <span
                className="h-2 w-16 overflow-hidden rounded-full bg-sand-200"
                title={`${pct}%`}
              >
                <span className="block h-full bg-sand-700" style={{ width: `${pct}%` }} />
              </span>
              <span className="text-xs text-sand-600">{done ? "done" : `${pct}%`}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
