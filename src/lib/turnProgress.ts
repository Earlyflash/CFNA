import type { SessionEntry } from "@prisma/client";

/** Land game — segments completed in a session (matches SessionEntry land fields). */
export const LAND_MILESTONES = [
  { key: "doneInitiative", label: "Initiative" },
  { key: "doneNaval", label: "Naval" },
  { key: "doneOpStage1", label: "Land — Ops Stage 1" },
  { key: "doneOpStage2", label: "Land — Ops Stage 2" },
  { key: "doneOpStage3", label: "Land — Ops Stage 3" },
] as const;

export type LandMilestoneKey = (typeof LAND_MILESTONES)[number]["key"];

/** Air game — strategic / convoy / land support per Ops Stage. */
export const AIR_MILESTONES = [
  { key: "doneAirStrategic", label: "Strategic air" },
  { key: "doneAirConvoy", label: "Convoy air" },
  { key: "doneAirLandOs1", label: "Air — Ops Stage 1" },
  { key: "doneAirLandOs2", label: "Air — Ops Stage 2" },
  { key: "doneAirLandOs3", label: "Air — Ops Stage 3" },
] as const;

export type AirMilestoneKey = (typeof AIR_MILESTONES)[number]["key"];

/** Logistics — stores, water & attrition, supply per Ops Stage. */
export const LOGISTICS_MILESTONES = [
  { key: "doneLogisticsStores", label: "Stores expenditure" },
  { key: "doneLogisticsWaterAttrition", label: "Water & attrition" },
  { key: "doneLogisticsSupplyOs1", label: "Supply — Ops Stage 1" },
  { key: "doneLogisticsSupplyOs2", label: "Supply — Ops Stage 2" },
  { key: "doneLogisticsSupplyOs3", label: "Supply — Ops Stage 3" },
] as const;

export type LogisticsMilestoneKey =
  (typeof LOGISTICS_MILESTONES)[number]["key"];

/**
 * Single table order: opening (initiative → naval → air strategic/convoy → logistics base),
 * then each Ops Stage as **air → supply → land**.
 */
export const TURN_FLOW_MILESTONES = [
  { key: "doneInitiative" as const, label: "Initiative", short: "In" },
  { key: "doneNaval" as const, label: "Naval convoy", short: "Nv" },
  { key: "doneAirStrategic" as const, label: "Strategic air", short: "As" },
  { key: "doneAirConvoy" as const, label: "Convoy air", short: "Ac" },
  { key: "doneLogisticsStores" as const, label: "Stores expenditure", short: "Fs" },
  {
    key: "doneLogisticsWaterAttrition" as const,
    label: "Water & attrition",
    short: "Wt",
  },
  { key: "doneAirLandOs1" as const, label: "Air — Ops Stage 1", short: "A1" },
  { key: "doneLogisticsSupplyOs1" as const, label: "Supply — Ops Stage 1", short: "S1" },
  { key: "doneOpStage1" as const, label: "Land — Ops Stage 1", short: "L1" },
  { key: "doneAirLandOs2" as const, label: "Air — Ops Stage 2", short: "A2" },
  { key: "doneLogisticsSupplyOs2" as const, label: "Supply — Ops Stage 2", short: "S2" },
  { key: "doneOpStage2" as const, label: "Land — Ops Stage 2", short: "L2" },
  { key: "doneAirLandOs3" as const, label: "Air — Ops Stage 3", short: "A3" },
  { key: "doneLogisticsSupplyOs3" as const, label: "Supply — Ops Stage 3", short: "S3" },
  { key: "doneOpStage3" as const, label: "Land — Ops Stage 3", short: "L3" },
] as const;

export type TurnFlowMilestone = (typeof TURN_FLOW_MILESTONES)[number];
export type TurnFlowMilestoneKey = TurnFlowMilestone["key"];

/** Graphic columns: each box lists milestones top → bottom (opening, then each Ops Stage air → supply → land). */
export type TurnFlowColumnGroup = {
  id: string;
  title: string;
  subtitle: string;
  milestones: readonly TurnFlowMilestone[];
};

const _m = TURN_FLOW_MILESTONES;

export const TURN_FLOW_COLUMN_GROUPS: readonly TurnFlowColumnGroup[] = [
  {
    id: "opening",
    title: "Opening",
    subtitle: "Initiative, naval, air, stores & attrition",
    milestones: [_m[0]!, _m[1]!, _m[2]!, _m[3]!, _m[4]!, _m[5]!],
  },
  {
    id: "ops1",
    title: "Ops Stage 1",
    subtitle: "Air → supply → land (top to bottom)",
    milestones: [_m[6]!, _m[7]!, _m[8]!],
  },
  {
    id: "ops2",
    title: "Ops Stage 2",
    subtitle: "Air → supply → land (top to bottom)",
    milestones: [_m[9]!, _m[10]!, _m[11]!],
  },
  {
    id: "ops3",
    title: "Ops Stage 3",
    subtitle: "Air → supply → land (top to bottom)",
    milestones: [_m[12]!, _m[13]!, _m[14]!],
  },
] as const;

export type AggregatedLandProgress = Record<LandMilestoneKey, boolean>;
export type AggregatedAirProgress = Record<AirMilestoneKey, boolean>;
export type AggregatedLogisticsProgress = Record<LogisticsMilestoneKey, boolean>;

export type FullTurnProgress = {
  gameTurn: number;
  land: AggregatedLandProgress;
  air: AggregatedAirProgress;
  logistics: AggregatedLogisticsProgress;
};

/** @deprecated Use AggregatedLandProgress */
export type AggregatedTurnProgress = AggregatedLandProgress;

const emptyLand: AggregatedLandProgress = {
  doneInitiative: false,
  doneNaval: false,
  doneOpStage1: false,
  doneOpStage2: false,
  doneOpStage3: false,
};

const emptyAir: AggregatedAirProgress = {
  doneAirStrategic: false,
  doneAirConvoy: false,
  doneAirLandOs1: false,
  doneAirLandOs2: false,
  doneAirLandOs3: false,
};

const emptyLogistics: AggregatedLogisticsProgress = {
  doneLogisticsStores: false,
  doneLogisticsWaterAttrition: false,
  doneLogisticsSupplyOs1: false,
  doneLogisticsSupplyOs2: false,
  doneLogisticsSupplyOs3: false,
};

function mergeLand(
  a: AggregatedLandProgress,
  b: AggregatedLandProgress
): AggregatedLandProgress {
  return {
    doneInitiative: a.doneInitiative || b.doneInitiative,
    doneNaval: a.doneNaval || b.doneNaval,
    doneOpStage1: a.doneOpStage1 || b.doneOpStage1,
    doneOpStage2: a.doneOpStage2 || b.doneOpStage2,
    doneOpStage3: a.doneOpStage3 || b.doneOpStage3,
  };
}

function mergeAir(
  a: AggregatedAirProgress,
  b: AggregatedAirProgress
): AggregatedAirProgress {
  return {
    doneAirStrategic: a.doneAirStrategic || b.doneAirStrategic,
    doneAirConvoy: a.doneAirConvoy || b.doneAirConvoy,
    doneAirLandOs1: a.doneAirLandOs1 || b.doneAirLandOs1,
    doneAirLandOs2: a.doneAirLandOs2 || b.doneAirLandOs2,
    doneAirLandOs3: a.doneAirLandOs3 || b.doneAirLandOs3,
  };
}

function mergeLogistics(
  a: AggregatedLogisticsProgress,
  b: AggregatedLogisticsProgress
): AggregatedLogisticsProgress {
  return {
    doneLogisticsStores: a.doneLogisticsStores || b.doneLogisticsStores,
    doneLogisticsWaterAttrition:
      a.doneLogisticsWaterAttrition || b.doneLogisticsWaterAttrition,
    doneLogisticsSupplyOs1:
      a.doneLogisticsSupplyOs1 || b.doneLogisticsSupplyOs1,
    doneLogisticsSupplyOs2:
      a.doneLogisticsSupplyOs2 || b.doneLogisticsSupplyOs2,
    doneLogisticsSupplyOs3:
      a.doneLogisticsSupplyOs3 || b.doneLogisticsSupplyOs3,
  };
}

function landFromEntry(
  e: Pick<SessionEntry, LandMilestoneKey>
): AggregatedLandProgress {
  return {
    doneInitiative: e.doneInitiative,
    doneNaval: e.doneNaval,
    doneOpStage1: e.doneOpStage1,
    doneOpStage2: e.doneOpStage2,
    doneOpStage3: e.doneOpStage3,
  };
}

function airFromEntry(e: Pick<SessionEntry, AirMilestoneKey>): AggregatedAirProgress {
  return {
    doneAirStrategic: e.doneAirStrategic,
    doneAirConvoy: e.doneAirConvoy,
    doneAirLandOs1: e.doneAirLandOs1,
    doneAirLandOs2: e.doneAirLandOs2,
    doneAirLandOs3: e.doneAirLandOs3,
  };
}

function logisticsFromEntry(
  e: Pick<SessionEntry, LogisticsMilestoneKey>
): AggregatedLogisticsProgress {
  return {
    doneLogisticsStores: e.doneLogisticsStores,
    doneLogisticsWaterAttrition: e.doneLogisticsWaterAttrition,
    doneLogisticsSupplyOs1: e.doneLogisticsSupplyOs1,
    doneLogisticsSupplyOs2: e.doneLogisticsSupplyOs2,
    doneLogisticsSupplyOs3: e.doneLogisticsSupplyOs3,
  };
}

/** Land-only aggregation (one row). */
export function aggregateLandTurn(
  entries: Pick<
    SessionEntry,
    | "gameTurn"
    | "doneInitiative"
    | "doneNaval"
    | "doneOpStage1"
    | "doneOpStage2"
    | "doneOpStage3"
  >[],
  fallbackGameTurn: number
): { gameTurn: number; land: AggregatedLandProgress } {
  if (entries.length === 0) {
    return { gameTurn: fallbackGameTurn, land: { ...emptyLand } };
  }
  const land = entries.reduce(
    (acc, e) => mergeLand(acc, landFromEntry(e)),
    { ...emptyLand }
  );
  return { gameTurn: entries[0]!.gameTurn, land };
}

/** @deprecated Use aggregateLandTurn */
export function aggregateTurn(
  entries: Pick<
    SessionEntry,
    | "gameTurn"
    | "doneInitiative"
    | "doneNaval"
    | "doneOpStage1"
    | "doneOpStage2"
    | "doneOpStage3"
  >[],
  fallbackGameTurn: number
): { gameTurn: number; progress: AggregatedLandProgress } {
  const { gameTurn, land } = aggregateLandTurn(entries, fallbackGameTurn);
  return { gameTurn, progress: land };
}

/** Full turn: land + air + logistics (OR across sessions per flag). */
export function aggregateFullTurn(
  entries: SessionEntry[],
  fallbackGameTurn: number
): FullTurnProgress {
  if (entries.length === 0) {
    return {
      gameTurn: fallbackGameTurn,
      land: { ...emptyLand },
      air: { ...emptyAir },
      logistics: { ...emptyLogistics },
    };
  }
  const land = entries.reduce(
    (acc, e) => mergeLand(acc, landFromEntry(e)),
    { ...emptyLand }
  );
  const air = entries.reduce(
    (acc, e) => mergeAir(acc, airFromEntry(e)),
    { ...emptyAir }
  );
  const logistics = entries.reduce(
    (acc, e) => mergeLogistics(acc, logisticsFromEntry(e)),
    { ...emptyLogistics }
  );
  return { gameTurn: entries[0]!.gameTurn, land, air, logistics };
}

/** OR-merge two full-turn snapshots (same `gameTurn` assumed for preview UI). */
export function mergeFullTurnProgress(a: FullTurnProgress, b: FullTurnProgress): FullTurnProgress {
  return {
    gameTurn: a.gameTurn,
    land: mergeLand(a.land, b.land),
    air: mergeAir(a.air, b.air),
    logistics: mergeLogistics(a.logistics, b.logistics),
  };
}

/** Build a full-turn object from per-milestone booleans (single session). */
export function fullTurnProgressFromPick(gameTurn: number, pick: SessionMilestonePick): FullTurnProgress {
  return {
    gameTurn,
    land: landFromEntry(pick),
    air: airFromEntry(pick),
    logistics: logisticsFromEntry(pick),
  };
}

/**
 * For each game-turn present in the DB, aggregate milestones across sessions.
 * Optionally exclude one entry (editing): peers show “rest of the turn” only.
 */
export function peerProgressByTurnFromEntries(
  entries: SessionEntry[],
  excludeEntryId?: string | null
): Record<number, FullTurnProgress> {
  const xs = excludeEntryId ? entries.filter((e) => e.id !== excludeEntryId) : [...entries];
  const byTurn = new Map<number, SessionEntry[]>();
  for (const e of xs) {
    const list = byTurn.get(e.gameTurn) ?? [];
    list.push(e);
    byTurn.set(e.gameTurn, list);
  }
  const out: Record<number, FullTurnProgress> = {};
  for (const [turn, list] of byTurn.entries()) {
    out[turn] = aggregateFullTurn(list, turn);
  }
  return out;
}

export function milestonePickFromSet(keys: ReadonlySet<TurnFlowMilestoneKey>): SessionMilestonePick {
  const o = {} as SessionMilestonePick;
  for (const m of TURN_FLOW_MILESTONES) {
    o[m.key] = keys.has(m.key);
  }
  return o;
}

export function flowMilestoneDone(
  full: FullTurnProgress,
  key: TurnFlowMilestoneKey
): boolean {
  if (key in full.land) return full.land[key as LandMilestoneKey];
  if (key in full.air) return full.air[key as AirMilestoneKey];
  return full.logistics[key as LogisticsMilestoneKey];
}

/** Booleans on `SessionEntry` that map to the unified turn-flow steps. */
export type SessionMilestonePick = Pick<SessionEntry, TurnFlowMilestoneKey>;

/** Which flow steps this single session checked (for per-episode graphic highlights). */
export function sessionCheckedFlowKeys(e: SessionMilestonePick): ReadonlySet<TurnFlowMilestoneKey> {
  const set = new Set<TurnFlowMilestoneKey>();
  for (const m of TURN_FLOW_MILESTONES) {
    if (e[m.key]) set.add(m.key);
  }
  return set;
}

/** Flow milestones this session checked, in canonical table order (matches the turn graphic). */
export function flowMilestonesDoneInSession(e: SessionMilestonePick): TurnFlowMilestone[] {
  return TURN_FLOW_MILESTONES.filter((m) => e[m.key]);
}

/** Completion of the unified 15-step turn flow (0–1). */
export function turnFlowCompletionRatio(full: FullTurnProgress): number {
  const done = TURN_FLOW_MILESTONES.filter((m) =>
    flowMilestoneDone(full, m.key)
  ).length;
  return done / TURN_FLOW_MILESTONES.length;
}

export function isTurnFlowComplete(full: FullTurnProgress): boolean {
  return TURN_FLOW_MILESTONES.every((m) => flowMilestoneDone(full, m.key));
}

export function landCompletionRatio(land: AggregatedLandProgress): number {
  const done = LAND_MILESTONES.filter((m) => land[m.key]).length;
  return done / LAND_MILESTONES.length;
}

/** @deprecated Use turnFlowCompletionRatio */
export function turnCompletionRatio(progress: AggregatedLandProgress): number {
  return landCompletionRatio(progress);
}

export function isLandTurnComplete(land: AggregatedLandProgress): boolean {
  return LAND_MILESTONES.every((m) => land[m.key]);
}

/** @deprecated Use isTurnFlowComplete with aggregateFullTurn */
export function isTurnComplete(progress: AggregatedLandProgress): boolean {
  return isLandTurnComplete(progress);
}
