"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FullTurnProgress } from "@/lib/turnProgress";
import { turnFlowCompletionRatio, isTurnFlowComplete } from "@/lib/turnProgress";

export type TurnNavSession = {
  id: string;
  title: string;
  playedAt: Date | string;
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
      className="rounded-2xl border border-wwam-gold/25 bg-wwam-ink/50 p-3 shadow-lg backdrop-blur-md sm:p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:w-80 lg:shrink-0 lg:overflow-y-auto"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-wwam-gold-light lg:mb-3">Play log</p>
      <p className="mb-3 text-[11px] leading-snug text-wwam-cream-muted/90">
        Newest turns at the top. Expand a turn to see sessions. Links open that turn and scroll the entry. All sections
        start collapsed.
      </p>
      <ul className="flex flex-col gap-2">
        {turns.map(({ gameTurn, full, sessionCount, sessions }) => {
          const pct = Math.round(turnFlowCompletionRatio(full) * 100);
          const done = isTurnFlowComplete(full);
          const turnSelected = gameTurn === selectedTurn;

          return (
            <li key={gameTurn}>
              <details
                data-turn-complete={done ? "true" : undefined}
                className={[
                  "group rounded-xl border shadow-sm transition-colors",
                  done
                    ? "border-emerald-500/55 bg-gradient-to-br from-emerald-950/55 via-emerald-950/25 to-wwam-void/60 ring-1 ring-emerald-400/20"
                    : "border-wwam-gold/20 bg-wwam-void/40",
                ].join(" ")}
              >
                <summary
                  className={[
                    "cursor-pointer list-none px-3 py-2.5 transition marker:content-none [&::-webkit-details-marker]:hidden",
                    done ? "rounded-t-xl" : "",
                  ].join(" ")}
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
                          className={[
                            "rounded font-mono text-sm font-bold underline decoration-wwam-gold-light/45 underline-offset-2 outline-none transition hover:decoration-wwam-gold-light focus-visible:ring-2 focus-visible:ring-wwam-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                            done
                              ? "text-emerald-100 decoration-emerald-300/50 hover:text-emerald-50 hover:decoration-emerald-200/80"
                              : "text-wwam-cream hover:text-wwam-gold-light",
                          ].join(" ")}
                        >
                          Turn {gameTurn}
                        </Link>
                        {done ? (
                          <span className="rounded-md border border-emerald-400/40 bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-200">
                            Complete
                          </span>
                        ) : null}
                        {turnSelected ? (
                          <span className="text-[10px] font-medium text-wwam-gold">Shown →</span>
                        ) : null}
                      </span>
                      <span className="mt-1 flex items-center gap-2">
                        <span
                          className={[
                            "inline-block h-1.5 w-20 max-w-full overflow-hidden rounded-full",
                            done ? "bg-emerald-950/80" : "bg-wwam-cream/15",
                          ].join(" ")}
                          title={`${pct}%`}
                        >
                          <span
                            className={[
                              "block h-full rounded-full",
                              done
                                ? "w-full bg-gradient-to-r from-emerald-500 to-teal-400"
                                : "bg-gradient-to-r from-axis/90 to-allied/90",
                            ].join(" ")}
                            style={done ? undefined : { width: `${pct}%` }}
                          />
                        </span>
                        <span
                          className={[
                            "font-mono text-[10px]",
                            done ? "text-emerald-200/90" : "text-wwam-cream-muted",
                          ].join(" ")}
                        >
                          {sessionCount} sess.
                        </span>
                      </span>
                    </span>
                    <span
                      className={[
                        "mt-0.5 shrink-0 transition group-open:rotate-180",
                        done ? "text-emerald-300/80" : "text-wwam-cream-muted",
                      ].join(" ")}
                      aria-hidden
                    >
                      ▼
                    </span>
                  </span>
                </summary>
                <div
                  className={[
                    "border-t px-2 pb-2 pt-1",
                    done ? "border-emerald-500/30 bg-emerald-950/20" : "border-wwam-gold/15",
                  ].join(" ")}
                >
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
                              "block rounded-lg px-2 py-2 text-left text-xs leading-snug transition",
                              active
                                ? "bg-wwam-gold/20 text-wwam-cream"
                                : "text-wwam-cream-muted hover:bg-wwam-gold/10 hover:text-wwam-cream",
                            ].join(" ")}
                          >
                            <span className="font-mono text-[10px] text-wwam-dune">{formatSessionWhen(s.playedAt)}</span>
                            <span className="mt-0.5 block font-medium text-wwam-cream/95 line-clamp-2">
                              {idx + 1}. {s.title}
                            </span>
                          </Link>
                          <Link
                            href={`/log/${s.id}`}
                            className="block rounded-md px-2 py-1 text-[10px] font-semibold text-red-300/95 transition hover:bg-red-950/30 hover:text-red-200"
                          >
                            Full episode view →
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
