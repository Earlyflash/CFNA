import { Fragment } from "react";
import type { FullTurnProgress, TurnFlowMilestone, TurnFlowMilestoneKey } from "@/lib/turnProgress";
import {
  TURN_FLOW_COLUMN_GROUPS,
  flowMilestoneDone,
  turnFlowCompletionRatio,
  isTurnFlowComplete,
} from "@/lib/turnProgress";
import styles from "./TurnProgressGraphic.module.css";

type Props = {
  full: FullTurnProgress;
  subtitle?: string;
  /** Steps checked in the focused session — drawn in red so they stand out from turn-wide progress. */
  sessionHighlightKeys?: ReadonlySet<TurnFlowMilestoneKey>;
};

function segmentIntoDone(full: FullTurnProgress, toKey: TurnFlowMilestoneKey) {
  return flowMilestoneDone(full, toKey);
}

/** Text / stroke colour for flow arrows (matches previous segment “done” logic). */
function segmentFlowColorClass(
  full: FullTurnProgress,
  toKey: TurnFlowMilestoneKey,
  sessionHighlightKeys?: ReadonlySet<TurnFlowMilestoneKey>
): string {
  if (sessionHighlightKeys?.has(toKey)) {
    return "text-red-600 drop-shadow-[0_0_6px_rgba(220,38,38,0.35)]";
  }
  if (segmentIntoDone(full, toKey)) return "text-wwam-ink";
  return "text-wwam-cream-muted";
}

/** Down arrow between milestones inside one phase. */
function VerticalStepFlowArrow({ colorClass }: { colorClass: string }) {
  return (
    <span className={[styles.arrowStepWrap, colorClass].join(" ")} aria-hidden>
      <svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="7" y1="2" x2="7" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <polygon points="7,19 4,14 10,14" fill="currentColor" />
      </svg>
    </span>
  );
}

/** Larger down arrow between phase panels (mobile stack). */
function VerticalPhaseGapArrow({ colorClass }: { colorClass: string }) {
  return (
    <span className={[styles.betweenPhasesMobile, colorClass].join(" ")} aria-hidden>
      <svg width="14" height="40" viewBox="0 0 14 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="7" y1="4" x2="7" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <polygon points="7,36 3.5,28 10.5,28" fill="currentColor" />
      </svg>
    </span>
  );
}

/** Right arrow between phase columns (desktop). */
function HorizontalPhaseGapArrow({ colorClass }: { colorClass: string }) {
  return (
    <span className={[styles.betweenPhasesDesktop, colorClass].join(" ")} aria-hidden>
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="2" y1="7" x2="18" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <polygon points="24,7 18,3.5 18,10.5" fill="currentColor" />
      </svg>
    </span>
  );
}

function StepNode({
  full,
  milestone,
  sessionHighlightKeys,
}: {
  full: FullTurnProgress;
  milestone: TurnFlowMilestone;
  sessionHighlightKeys?: ReadonlySet<TurnFlowMilestoneKey>;
}) {
  const done = flowMilestoneDone(full, milestone.key);
  const sessionHit = sessionHighlightKeys?.has(milestone.key) ?? false;

  const circleClass = sessionHit
    ? "border-red-700 bg-red-600 text-white shadow-md shadow-red-900/40 ring-2 ring-red-400/50"
    : done
      ? "border-wwam-ink bg-wwam-ink text-wwam-cream"
      : "border-wwam-cream-muted/60 bg-white/90 text-wwam-cream-muted";

  const labelClass = sessionHit
    ? "font-bold text-red-800"
    : done
      ? "text-wwam-ink"
      : "text-wwam-dune";

  const ariaLabel = sessionHit
    ? `${milestone.label}, logged in this episode`
    : done
      ? `${milestone.label}, complete for this turn`
      : `${milestone.label}, not done for this turn`;

  return (
    <div className={styles.stepNode} title={milestone.label}>
      <div className={[styles.stepCircle, circleClass].join(" ")} aria-label={ariaLabel}>
        {milestone.short}
      </div>
      <p className={[styles.stepLabel, labelClass].join(" ")}>{milestone.label}</p>
    </div>
  );
}

function VerticalStepColumn({
  full,
  milestones,
  sessionHighlightKeys,
  ariaLabel,
}: {
  full: FullTurnProgress;
  milestones: readonly TurnFlowMilestone[];
  sessionHighlightKeys?: ReadonlySet<TurnFlowMilestoneKey>;
  ariaLabel: string;
}) {
  return (
    <div className={styles.stepsColumn} aria-label={ariaLabel}>
      {milestones.map((m, i) => {
        const hasNext = i < milestones.length - 1;
        const next = hasNext ? milestones[i + 1]! : null;
        return (
          <div key={m.key} className={styles.stepRow}>
            <StepNode full={full} milestone={m} sessionHighlightKeys={sessionHighlightKeys} />
            {hasNext && next ? (
              <VerticalStepFlowArrow
                colorClass={segmentFlowColorClass(full, next.key, sessionHighlightKeys)}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function TurnProgressGraphic({ full, subtitle, sessionHighlightKeys }: Props) {
  const overall = turnFlowCompletionRatio(full);
  const complete = isTurnFlowComplete(full);
  const overallPct = Math.round(overall * 100);
  const hasSessionHighlight = (sessionHighlightKeys?.size ?? 0) > 0;

  const groups = TURN_FLOW_COLUMN_GROUPS;

  return (
    <div className="rounded-3xl border border-wwam-gold/30 bg-gradient-to-br from-wwam-card via-wwam-card to-[#efe4d4] p-6 shadow-xl shadow-black/25 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-wwam-dune">Game-turn progress</p>
          <h2 className="font-mono text-2xl font-semibold text-wwam-ink sm:text-3xl">Turn {full.gameTurn}</h2>
          {subtitle ? <p className="mt-1 max-w-3xl text-sm text-wwam-dune">{subtitle}</p> : null}
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold tabular-nums text-wwam-ink">{overallPct}%</p>
          <p className="text-xs font-medium text-wwam-dune">{complete ? "Turn closed" : "In progress"}</p>
        </div>
      </div>

      <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-wwam-cream-muted/40">
        <div
          className="h-full rounded-full bg-gradient-to-r from-axis via-wwam-gold/80 to-allied transition-[width] duration-700 ease-out"
          style={{ width: `${overallPct}%` }}
          role="progressbar"
          aria-label="Turn flow progress"
          aria-valuenow={overallPct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className={styles.phaseGrid} role="group" aria-label="Turn flow by phase">
        {groups.map((group, gi) => {
          const nextGroup = gi < groups.length - 1 ? groups[gi + 1]! : null;
          const toNextPhaseKey = nextGroup?.milestones[0]?.key;

          return (
            <Fragment key={group.id}>
              <div
                className={[
                  styles.phasePanel,
                  "rounded-2xl border px-3 py-4 sm:px-4",
                  group.id === "opening"
                    ? "border-wwam-gold/25 bg-white/50"
                    : "border-wwam-gold/20 bg-white/40",
                ].join(" ")}
              >
                <div className={styles.phaseHeader}>
                  <p className="font-display text-sm font-semibold text-wwam-ink">{group.title}</p>
                  <p className="mt-0.5 text-[10px] font-medium leading-snug text-wwam-dune">{group.subtitle}</p>
                </div>
                <VerticalStepColumn
                  full={full}
                  milestones={group.milestones}
                  sessionHighlightKeys={sessionHighlightKeys}
                  ariaLabel={
                    group.id === "opening"
                      ? "Opening phases in order, top to bottom"
                      : `${group.title}: air, then supply, then land`
                  }
                />
              </div>

              {toNextPhaseKey ? (
                <>
                  <VerticalPhaseGapArrow
                    colorClass={segmentFlowColorClass(full, toNextPhaseKey, sessionHighlightKeys)}
                  />
                  <HorizontalPhaseGapArrow
                    colorClass={segmentFlowColorClass(full, toNextPhaseKey, sessionHighlightKeys)}
                  />
                </>
              ) : null}
            </Fragment>
          );
        })}
      </div>

      {hasSessionHighlight ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50/90 px-3 py-2 text-xs leading-relaxed text-red-950">
          <strong className="font-semibold text-red-800">Red</strong> highlights steps ticked in{" "}
          <strong className="font-semibold text-red-800">this episode</strong>. Filled dark nodes are still “done for
          the turn” from any session; red calls out what this log contributed.
        </p>
      ) : null}
      <p className={hasSessionHighlight ? "mt-4 text-xs leading-relaxed text-wwam-dune" : "mt-10 text-xs leading-relaxed text-wwam-dune"}>
        Arrows show <strong className="text-wwam-ink">flow</strong> top to bottom in each phase, then{" "}
        <strong className="text-wwam-ink">Opening</strong> → each <strong className="text-wwam-ink">Ops Stage</strong>{" "}
        (<strong className="text-wwam-ink">air → supply → land</strong>). Colour matches whether the next step is done
        for the turn (or highlighted for this episode).
      </p>
    </div>
  );
}
