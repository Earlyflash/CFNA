"use client";

import { SessionEntryCard, type EntryWithImages } from "@/components/SessionEntryCard";

export type TurnSessionGroup = {
  turn: number;
  sessions: EntryWithImages[];
};

type Props = {
  /** Expects the selected turn only (sidebar / `?turn=` filter). */
  groups: TurnSessionGroup[];
};

export function SessionsByTurnAccordion({ groups }: Props) {
  if (!groups.length) {
    return (
      <p className="rounded-2xl border border-wwam-gold/20 bg-wwam-ink/30 px-5 py-8 text-center text-sm text-wwam-cream-muted backdrop-blur-sm">
        No sessions published yet.
      </p>
    );
  }

  const { turn, sessions } = groups[0]!;
  return (
    <div className="space-y-6">
      <p className="font-mono text-sm text-wwam-gold-light">
        Turn {turn} · {sessions.length} session{sessions.length === 1 ? "" : "s"} · newest first
      </p>
      {sessions.map((entry, index) => (
        <div
          key={entry.id}
          id={`session-${entry.id}`}
          className="scroll-mt-28"
        >
          <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-wwam-cream-muted">
            Ep {entry.episodeNumber}
            {sessions.length > 1 ? ` · ${index + 1} of ${sessions.length} this turn` : ""}
          </p>
          <SessionEntryCard entry={entry} showTurnBadge={false} />
        </div>
      ))}
    </div>
  );
}
