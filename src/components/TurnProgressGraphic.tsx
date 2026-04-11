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
  sessionHighlightKeys?: ReadonlySet<TurnFlowMilestoneKey>;
};

function segmentIntoDone(full: FullTurnProgress, toKey: TurnFlowMilestoneKey) {
  return flowMilestoneDone(full, toKey);
}

function segmentFlowColorClass(
  full: FullTurnProgress,
  toKey: TurnFlowMilestoneKey,
  sessionHighlightKeys?: ReadonlySet<TurnFlowMilestoneKey>
): string {
  if (sessionHighlightKeys?.has(toKey)) {
    return "text-np-red";
  }
  if (segmentIntoDone(full, toKey)) return "text-np-ink";
  return "text-np-ink-muted";
}

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
    ? "border-np-red bg-np-red text-white"
    : done
      ? "border-np-ink bg-np-ink text-np-paper"
      : "border-np-ink-muted bg-np-paper text-np-ink-muted";

  const labelClass = sessionHit
    ? "font-bold text-np-red"
    : done
      ? "text-np-ink"
      : "text-np-ink-muted";

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
    <div className="border border-np-rule bg-np-paper p-5 shadow-print sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-np-ink-muted">War Progress</p>
          <h2 className="font-display text-2xl font-bold text-np-ink sm:text-3xl">Turn {full.gameTurn}</h2>
          {subtitle ? <p className="mt-1 max-w-3xl text-xs italic text-np-ink-muted">{subtitle}</p> : null}
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-bold tabular-nums text-np-ink">{overallPct}%</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-np-ink-muted">
            {complete ? "Turn Closed" : "In Progress"}
          </p>
        </div>
      </div>

      <div className="mt-4 h-2.5 w-full overflow-hidden border border-np-ink bg-np-paper-dark">
        <div
          className="h-full bg-np-ink transition-[width] duration-700 ease-out"
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
                  "border border-np-rule px-3 py-3 sm:px-4",
                ].join(" ")}
              >
                <div className={styles.phaseHeader}>
                  <p className="font-display text-sm font-bold text-np-ink">{group.title}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-np-ink-muted">{group.subtitle}</p>
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
        <p className="mt-5 border border-np-red/30 bg-np-paper-dark px-3 py-2 text-xs leading-relaxed text-np-ink">
          <strong className="font-bold text-np-red">Red</strong> highlights steps ticked in{" "}
          <strong className="font-bold text-np-red">this dispatch</strong>. Filled dark nodes are &ldquo;done for
          the turn&rdquo; from any session; red marks what this log contributed.
        </p>
      ) : null}
      <p className={hasSessionHighlight ? "mt-3 text-xs leading-relaxed italic text-np-ink-muted" : "mt-6 text-xs leading-relaxed italic text-np-ink-muted"}>
        Arrows show <strong className="not-italic text-np-ink">flow</strong> top to bottom in each phase, then{" "}
        <strong className="not-italic text-np-ink">Opening</strong> &rarr; each{" "}
        <strong className="not-italic text-np-ink">Ops Stage</strong>{" "}
        (<strong className="not-italic text-np-ink">air &rarr; supply &rarr; land</strong>).
      </p>
    </div>
  );
}
