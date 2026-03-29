"use client";

import { Fragment, useMemo, useState } from "react";
import type { FullTurnProgress, TurnFlowMilestone, TurnFlowMilestoneKey } from "@/lib/turnProgress";
import {
  TURN_FLOW_COLUMN_GROUPS,
  TURN_FLOW_MILESTONES,
  aggregateFullTurn,
  flowMilestoneDone,
  fullTurnProgressFromPick,
  isTurnFlowComplete,
  mergeFullTurnProgress,
  milestonePickFromSet,
  turnFlowCompletionRatio,
} from "@/lib/turnProgress";
import styles from "./TurnProgressGraphic.module.css";

type Props = {
  gameTurn: number;
  peerProgressByTurn: Record<number, FullTurnProgress>;
  /** Checked milestones for this log entry (edit) or empty (create). */
  initialSessionKeys: ReadonlySet<TurnFlowMilestoneKey>;
};

function segmentIntoDone(full: FullTurnProgress, toKey: TurnFlowMilestoneKey) {
  return flowMilestoneDone(full, toKey);
}

function segmentFlowColorClass(
  previewFull: FullTurnProgress,
  toKey: TurnFlowMilestoneKey,
  sessionKeys: ReadonlySet<TurnFlowMilestoneKey>
): string {
  if (sessionKeys.has(toKey)) {
    return "text-red-600 drop-shadow-[0_0_6px_rgba(220,38,38,0.35)]";
  }
  if (segmentIntoDone(previewFull, toKey)) return "text-wwam-ink";
  return "text-wwam-cream-muted";
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

function InteractiveStepNode({
  milestone,
  peerFull,
  selected,
  onToggle,
}: {
  milestone: TurnFlowMilestone;
  peerFull: FullTurnProgress;
  selected: ReadonlySet<TurnFlowMilestoneKey>;
  onToggle: (key: TurnFlowMilestoneKey) => void;
}) {
  const sessionOn = selected.has(milestone.key);
  const peerDone = flowMilestoneDone(peerFull, milestone.key);

  const circleClass = sessionOn
    ? "border-red-700 bg-red-600 text-white shadow-md shadow-red-900/40 ring-2 ring-red-400/50"
    : peerDone
      ? "border-wwam-ink bg-wwam-ink text-wwam-cream"
      : "border-wwam-cream-muted/60 bg-white/90 text-wwam-cream-muted";

  const labelClass = sessionOn
    ? "font-bold text-red-800"
    : peerDone
      ? "text-wwam-ink"
      : "text-wwam-dune";

  const aria = sessionOn
    ? `${milestone.label}, selected for this session`
    : peerDone
      ? `${milestone.label}, already logged in another session this turn — click to add for this session`
      : `${milestone.label}, not selected — click to mark done this session`;

  return (
    <div className={styles.stepNode}>
      <button
        type="button"
        onClick={() => onToggle(milestone.key)}
        className="flex w-full max-w-full flex-col items-center rounded-lg outline-none transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-wwam-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        aria-pressed={sessionOn}
        aria-label={aria}
      >
        <span className={[styles.stepCircle, circleClass].join(" ")}>{milestone.short}</span>
        <span className={[styles.stepLabel, labelClass, "block"].join(" ")}>{milestone.label}</span>
      </button>
    </div>
  );
}

function InteractiveStepColumn({
  peerFull,
  previewFull,
  milestones,
  selected,
  onToggle,
  ariaLabel,
}: {
  peerFull: FullTurnProgress;
  previewFull: FullTurnProgress;
  milestones: readonly TurnFlowMilestone[];
  selected: ReadonlySet<TurnFlowMilestoneKey>;
  onToggle: (key: TurnFlowMilestoneKey) => void;
  ariaLabel: string;
}) {
  return (
    <div className={styles.stepsColumn} aria-label={ariaLabel}>
      {milestones.map((m, i) => {
        const hasNext = i < milestones.length - 1;
        const next = hasNext ? milestones[i + 1]! : null;
        return (
          <div key={m.key} className={styles.stepRow}>
            <InteractiveStepNode milestone={m} peerFull={peerFull} selected={selected} onToggle={onToggle} />
            {hasNext && next ? (
              <VerticalStepFlowArrow colorClass={segmentFlowColorClass(previewFull, next.key, selected)} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function SessionTurnFlowPicker({ gameTurn, peerProgressByTurn, initialSessionKeys }: Props) {
  const [selected, setSelected] = useState<Set<TurnFlowMilestoneKey>>(
    () => new Set(initialSessionKeys)
  );

  const peerFull = useMemo(() => {
    return peerProgressByTurn[gameTurn] ?? aggregateFullTurn([], gameTurn);
  }, [peerProgressByTurn, gameTurn]);

  const previewFull = useMemo(() => {
    const sessionSlice = fullTurnProgressFromPick(gameTurn, milestonePickFromSet(selected));
    return mergeFullTurnProgress(
      { ...peerFull, gameTurn },
      { ...sessionSlice, gameTurn }
    );
  }, [peerFull, gameTurn, selected]);

  const overall = turnFlowCompletionRatio(previewFull);
  const complete = isTurnFlowComplete(previewFull);
  const overallPct = Math.round(overall * 100);
  const hasSessionSelection = selected.size > 0;

  function toggle(key: TurnFlowMilestoneKey) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const groups = TURN_FLOW_COLUMN_GROUPS;

  return (
    <div className="rounded-3xl border border-wwam-gold/30 bg-gradient-to-br from-wwam-card via-wwam-card to-[#efe4d4] p-5 shadow-xl shadow-black/25 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-wwam-dune">This session · game-turn {gameTurn}</p>
          <h3 className="font-mono text-lg font-semibold text-wwam-ink sm:text-xl">Tap circles to match this recording</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold tabular-nums text-wwam-ink">{overallPct}%</p>
          <p className="text-xs font-medium text-wwam-dune">{complete ? "Full flow covered" : "In progress"}</p>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-wwam-dune">
        <strong className="text-wwam-ink">Dark</strong> = already marked in another session for this turn.{" "}
        <strong className="text-red-800">Red</strong> = you are adding for <em>this</em> log (same as the public episode
        view). Percent includes both.
      </p>

      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-wwam-cream-muted/40">
        <div
          className="h-full rounded-full bg-gradient-to-r from-axis via-wwam-gold/80 to-allied transition-[width] duration-500 ease-out"
          style={{ width: `${overallPct}%` }}
          role="progressbar"
          aria-label="Combined turn flow if you save this session"
          aria-valuenow={overallPct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className={styles.phaseGrid} role="group" aria-label="Turn flow — tap steps for this session">
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
                <InteractiveStepColumn
                  peerFull={peerFull}
                  previewFull={previewFull}
                  milestones={group.milestones}
                  selected={selected}
                  onToggle={toggle}
                  ariaLabel={
                    group.id === "opening"
                      ? "Opening phases in order, top to bottom"
                      : `${group.title}: air, then supply, then land`
                  }
                />
              </div>

              {toNextPhaseKey ? (
                <>
                  <VerticalPhaseGapArrow colorClass={segmentFlowColorClass(previewFull, toNextPhaseKey, selected)} />
                  <HorizontalPhaseGapArrow colorClass={segmentFlowColorClass(previewFull, toNextPhaseKey, selected)} />
                </>
              ) : null}
            </Fragment>
          );
        })}
      </div>

      {hasSessionSelection ? (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50/90 px-3 py-2 text-xs leading-relaxed text-red-950">
          <strong className="font-semibold text-red-800">Red</strong> steps will be saved on this entry. Dark steps are
          only a guide from other sessions — toggle red to add what this sitting finished.
        </p>
      ) : null}

      {TURN_FLOW_MILESTONES.map((m) =>
        selected.has(m.key) ? <input key={m.key} type="hidden" name={m.key} value="on" /> : null
      )}
    </div>
  );
}
