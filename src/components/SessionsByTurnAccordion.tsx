"use client";

import { SessionEntryCard, type EntryWithImages } from "@/components/SessionEntryCard";

export type TurnSessionGroup = {
  turn: number;
  sessions: EntryWithImages[];
};

type Props = {
  groups: TurnSessionGroup[];
};

export function SessionsByTurnAccordion({ groups }: Props) {
  if (!groups.length) {
    return (
      <p className="border border-np-rule px-5 py-8 text-center text-sm italic text-np-ink-muted">
        No sessions published yet.
      </p>
    );
  }

  const { turn, sessions } = groups[0]!;
  return (
    <div className="space-y-6">
      <p className="font-mono text-sm text-np-ink-muted">
        Turn {turn} &middot; {sessions.length} dispatch{sessions.length === 1 ? "" : "es"} &middot; newest first
      </p>
      {sessions.map((entry, index) => (
        <div
          key={entry.id}
          id={`session-${entry.id}`}
          className="scroll-mt-28"
        >
          <p className="mb-1 font-mono text-xs font-bold uppercase tracking-wider text-np-ink-muted">
            Ep {entry.episodeNumber}
            {sessions.length > 1 ? ` \u2014 ${index + 1} of ${sessions.length} this turn` : ""}
          </p>
          <SessionEntryCard entry={entry} showTurnBadge={false} />
        </div>
      ))}
    </div>
  );
}
