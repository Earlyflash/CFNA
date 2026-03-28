import type { SessionEntry } from "@prisma/client";

export type TurnMilestone = {
  key: "initiative" | "naval" | "op1" | "op2" | "op3";
  label: string;
  short: string;
};

export const TURN_MILESTONES: TurnMilestone[] = [
  { key: "initiative", label: "Initiative", short: "I" },
  { key: "naval", label: "Naval convoy", short: "N" },
  { key: "op1", label: "Operations stage 1", short: "OS1" },
  { key: "op2", label: "Operations stage 2", short: "OS2" },
  { key: "op3", label: "Operations stage 3", short: "OS3" },
];

export type AggregatedTurnProgress = {
  gameTurn: number;
  initiative: boolean;
  naval: boolean;
  op1: boolean;
  op2: boolean;
  op3: boolean;
};

export function aggregateTurn(entries: SessionEntry[], gameTurnFallback: number): AggregatedTurnProgress {
  const gameTurn = entries[0]?.gameTurn ?? gameTurnFallback;
  return {
    gameTurn,
    initiative: entries.some((e) => e.doneInitiative),
    naval: entries.some((e) => e.doneNaval),
    op1: entries.some((e) => e.doneOpStage1),
    op2: entries.some((e) => e.doneOpStage2),
    op3: entries.some((e) => e.doneOpStage3),
  };
}

export function milestoneDone(progress: AggregatedTurnProgress, key: TurnMilestone["key"]): boolean {
  switch (key) {
    case "initiative":
      return progress.initiative;
    case "naval":
      return progress.naval;
    case "op1":
      return progress.op1;
    case "op2":
      return progress.op2;
    case "op3":
      return progress.op3;
    default:
      return false;
  }
}

export function turnCompletionRatio(progress: AggregatedTurnProgress): number {
  const flags = [progress.initiative, progress.naval, progress.op1, progress.op2, progress.op3];
  return flags.filter(Boolean).length / flags.length;
}

export function isTurnComplete(progress: AggregatedTurnProgress): boolean {
  return turnCompletionRatio(progress) >= 1;
}
