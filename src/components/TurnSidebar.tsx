"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FullTurnProgress } from "@/lib/turnProgress";
import { turnFlowCompletionRatio, isTurnFlowComplete } from "@/lib/turnProgress";

export type TurnNavSession = {
  id: string;
  title: string;
  playedAt: Date | string;
  publishedBy: string | null;
};

export type TurnNavItem = {
  gameTurn: number;
  full: FullTurnProgress;
  sessionCount: number;
  sessions: TurnNavSession[];
};

type Props = {
  turns: TurnNavItem[];
  selectedTurn: number;
};

function formatSessionWhen(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

function useHashSessionId() {
  const [hashId, setHashId] = useState("");
  useEffect(() => {
    const read = () => setHashId(window.location.hash.replace(/^#/, ""));
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  return hashId;
}

export function TurnSidebar({ turns, selectedTurn }: Props) {
  const hashId = useHashSessionId();

  if (!turns.length) return null;

  return (
    <nav
      aria-label="Game-turns and sessions"
      className="border border-np-rule bg-np-paper p-3 sm:p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:w-72 lg:shrink-0 lg:overflow-y-auto"
    >
      <p className="border-b-2 border-np-ink pb-1 font-display text-sm font-bold uppercase tracking-wider text-np-ink">
        Index
      </p>
      <p className="mt-2 text-[11px] leading-snug text-np-ink-muted">
        Newest turns first. Expand a turn to see dispatches.
      </p>
      <ul className="mt-3 flex flex-col">
        {turns.map(({ gameTurn, full, sessionCount, sessions }) => {
          const pct = Math.round(turnFlowCompletionRatio(full) * 100);
          const done = isTurnFlowComplete(full);
          const turnSelected = gameTurn === selectedTurn;

          return (
            <li key={gameTurn} className="border-t border-np-rule-light">
              <details className="group">
                <summary
                  className="cursor-pointer list-none px-1 py-2 transition marker:content-none [&::-webkit-details-marker]:hidden"
                  aria-label={
                    done
                      ? `Turn ${gameTurn}, complete — ${sessionCount} sessions`
                      : `Turn ${gameTurn}, in progress — ${sessionCount} sessions`
                  }
                >
                  <span className="flex items-start justify-between gap-2">
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <Link
                          href={`/?turn=${gameTurn}`}
                          scroll={false}
                          onClick={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="font-mono text-sm font-bold text-np-ink underline-offset-2 outline-none transition hover:underline"
                        >
                          Turn {gameTurn}
                        </Link>
                        {done ? (
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-np-ink-muted">
                            [Complete]
                          </span>
                        ) : null}
                        {turnSelected ? (
                          <span className="font-mono text-[10px] font-bold text-np-red">&rarr; Shown</span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 flex items-center gap-2 text-np-ink-muted">
                        <span className="font-mono text-[10px]">
                          {sessionCount} dispatch{sessionCount === 1 ? "" : "es"} &middot; {pct}%
                        </span>
                      </span>
                    </span>
                    <span className="mt-1 shrink-0 text-np-ink-muted transition group-open:rotate-180" aria-hidden>
                      &#9660;
                    </span>
                  </span>
                </summary>
                <div className="border-t border-dashed border-np-rule-light px-1 pb-2 pt-1">
                  <ul className="space-y-0.5">
                    {sessions.map((s, idx) => {
                      const sessionDomId = `session-${s.id}`;
                      const active = hashId === sessionDomId && turnSelected;
                      return (
                        <li key={s.id} className="space-y-0.5">
                          <Link
                            href={`/?turn=${gameTurn}#${sessionDomId}`}
                            scroll={false}
                            className={[
                              "block px-1 py-1.5 text-left text-xs leading-snug transition",
                              active
                                ? "bg-np-aged/40 text-np-ink"
                                : "text-np-ink-light hover:bg-np-aged/20 hover:text-np-ink",
                            ].join(" ")}
                          >
                            <span className="font-mono text-[10px] text-np-ink-muted">
                              {formatSessionWhen(s.playedAt)}
                              {s.publishedBy ? ` \u00B7 ${s.publishedBy}` : ""}
                            </span>
                            <span className="mt-0.5 block font-medium text-np-ink/90 line-clamp-2">
                              {idx + 1}. {s.title}
                            </span>
                          </Link>
                          <Link
                            href={`/log/${s.id}`}
                            className="block px-1 py-0.5 font-mono text-[10px] font-semibold text-np-red transition hover:underline"
                          >
                            Full dispatch &rarr;
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
