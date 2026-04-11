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
  if (sessionKeys.has(toKey)) return "text-np-red";
  if (segmentIntoDone(previewFull, toKey)) return "text-np-ink";
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
    ? "border-np-red bg-np-red text-white"
    : peerDone
      ? "border-np-ink bg-np-ink text-np-paper"
      : "border-np-ink-muted bg-np-paper text-np-ink-muted";

  const labelClass = sessionOn
    ? "font-bold text-np-red"
    : peerDone
      ? "text-np-ink"
      : "text-np-ink-muted";

  const aria = sessionOn
    ? `${milestone.label}, selected for this session`
    : peerDone
      ? `${milestone.label}, already logged in another session this turn \u2014 click to add for this session`
      : `${milestone.label}, not selected \u2014 click to mark done this session`;

  return (
    <div className={styles.stepNode}>
      <button
        type="button"
        onClick={() => onToggle(milestone.key)}
        className="flex w-full max-w-full flex-col items-center outline-none transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-np-ink focus-visible:ring-offset-2 focus-visible:ring-offset-np-paper"
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
    <div className="border border-np-rule bg-np-paper p-5 shadow-print sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-np-ink-muted">
            This session &middot; game-turn {gameTurn}
          </p>
          <h3 className="font-display text-lg font-bold text-np-ink sm:text-xl">Tap circles to match this recording</h3>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold tabular-nums text-np-ink">{overallPct}%</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-np-ink-muted">
            {complete ? "Full flow covered" : "In progress"}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-np-ink-muted">
        <strong className="text-np-ink">Dark</strong> = already marked in another session for this turn.{" "}
        <strong className="text-np-red">Red</strong> = you are adding for <em>this</em> log (same as the public dispatch
        view). Percent includes both.
      </p>

      <div className="mt-4 h-2.5 w-full overflow-hidden border border-np-ink bg-np-paper-dark">
        <div
          className="h-full bg-np-ink transition-[width] duration-500 ease-out"
          style={{ width: `${overallPct}%` }}
          role="progressbar"
          aria-label="Combined turn flow if you save this session"
          aria-valuenow={overallPct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className={styles.phaseGrid} role="group" aria-label="Turn flow \u2014 tap steps for this session">
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
        <p className="mt-5 border border-np-red/30 bg-np-paper-dark px-3 py-2 text-xs leading-relaxed text-np-ink">
          <strong className="font-bold text-np-red">Red</strong> steps will be saved on this entry. Dark steps are
          only a guide from other sessions &mdash; toggle red to add what this sitting finished.
        </p>
      ) : null}

      {TURN_FLOW_MILESTONES.map((m) =>
        selected.has(m.key) ? <input key={m.key} type="hidden" name={m.key} value="on" /> : null
      )}
    </div>
  );
}
