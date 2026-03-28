import type { AggregatedTurnProgress } from "@/lib/turnProgress";
import { TURN_MILESTONES, milestoneDone, turnCompletionRatio, isTurnComplete } from "@/lib/turnProgress";

type Props = {
  progress: AggregatedTurnProgress;
  subtitle?: string;
};

export function TurnProgressGraphic({ progress, subtitle }: Props) {
  const ratio = turnCompletionRatio(progress);
  const complete = isTurnComplete(progress);
  const pct = Math.round(ratio * 100);

  return (
    <div className="rounded-2xl border border-sand-300 bg-gradient-to-br from-sand-50 to-sand-100 p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-sand-700">Game-turn progress</p>
          <h2 className="font-mono text-2xl font-semibold text-sand-900">Turn {progress.gameTurn}</h2>
          {subtitle ? <p className="mt-1 max-w-xl text-sm text-sand-700">{subtitle}</p> : null}
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold tabular-nums text-sand-900">{pct}%</p>
          <p className="text-xs text-sand-600">{complete ? "Turn closed" : "In progress"}</p>
        </div>
      </div>

      <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-sand-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-axis to-allied transition-[width] duration-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="relative mt-10 px-1">
        <div
          className="absolute left-[10%] right-[10%] top-5 hidden h-1 rounded-full bg-sand-200 sm:block"
          aria-hidden
        />
        <div className="relative grid grid-cols-5 gap-1 sm:gap-2">
          {TURN_MILESTONES.map((m) => {
            const done = milestoneDone(progress, m.key);
            return (
              <div key={m.key} className="flex flex-col items-center text-center">
                <div
                  className={[
                    "relative z-[1] flex h-11 w-11 items-center justify-center rounded-full border-2 font-mono text-xs font-bold shadow-md sm:h-12 sm:w-12 sm:text-sm",
                    done
                      ? "border-sand-800 bg-sand-800 text-sand-50"
                      : "border-sand-300 bg-white text-sand-400",
                  ].join(" ")}
                  title={m.label}
                >
                  {m.short}
                </div>
                <p
                  className={[
                    "mt-2 px-0.5 text-[10px] font-medium leading-tight sm:text-xs",
                    done ? "text-sand-900" : "text-sand-500",
                  ].join(" ")}
                >
                  {m.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-6 text-xs text-sand-600">
        Segments marked complete in <strong>any</strong> Axis or Allied session for this turn are shown as done
        (combined play log).
      </p>
    </div>
  );
}
