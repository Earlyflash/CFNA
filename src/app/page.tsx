import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { aggregateFullTurn } from "@/lib/turnProgress";
import { TurnProgressGraphic } from "@/components/TurnProgressGraphic";
import { TurnSidebar, type TurnNavItem } from "@/components/TurnSidebar";
import { SessionsByTurnAccordion, type TurnSessionGroup } from "@/components/SessionsByTurnAccordion";
import { ScrollToHash } from "@/components/ScrollToHash";
import { CompassMark } from "@/components/CompassMark";
import { sortSessionsByNewestFirst } from "@/lib/sessionSort";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ turn?: string }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const { turn: turnParam } = await searchParams;

  const campaign = await prisma.campaign.findFirst({
    orderBy: { createdAt: "asc" },
    include: {
      sessionEntries: {
        include: { images: true },
        orderBy: { playedAt: "desc" },
      },
    },
  });

  if (!campaign) {
    return (
      <p className="rounded-2xl border border-wwam-gold/20 bg-wwam-ink/50 p-6 text-wwam-cream-muted backdrop-blur-sm">
        No campaign found. Run <code className="text-wwam-gold-light">npx prisma db push</code> and{" "}
        <code className="text-wwam-gold-light">npm run db:seed</code>.
      </p>
    );
  }

  const byTurn = new Map<number, typeof campaign.sessionEntries>();
  for (const e of campaign.sessionEntries) {
    const list = byTurn.get(e.gameTurn) ?? [];
    list.push(e);
    byTurn.set(e.gameTurn, list);
  }

  const turnNumbers = [...byTurn.keys()].sort((a, b) => b - a);
  const latestTurn = turnNumbers.length ? Math.max(...turnNumbers) : 1;

  const parsed = turnParam !== undefined ? parseInt(turnParam, 10) : NaN;
  const selectedTurn =
    Number.isFinite(parsed) && byTurn.has(parsed) ? parsed : latestTurn;

  const selectedEntries = byTurn.get(selectedTurn) ?? [];
  const selectedFull = aggregateFullTurn(selectedEntries, selectedTurn);

  const sidebarTurns: TurnNavItem[] = turnNumbers.map((t) => {
    const sessions = sortSessionsByNewestFirst(byTurn.get(t) ?? []);
    return {
      gameTurn: t,
      full: aggregateFullTurn(sessions, t),
      sessionCount: sessions.length,
      sessions: sessions.map((e) => ({
        id: e.id,
        title: e.title,
        playedAt: e.playedAt,
      })),
    };
  });

  const allTurnGroups: TurnSessionGroup[] = turnNumbers.map((t) => {
    const sessions = sortSessionsByNewestFirst(byTurn.get(t) ?? []);
    return { turn: t, sessions };
  });

  /** Main list follows the sidebar / `?turn=` — only this turn’s sessions. */
  const visibleTurnGroups = allTurnGroups.filter((g) => g.turn === selectedTurn);

  const hasSessions = campaign.sessionEntries.length > 0;

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-wwam-gold/25 bg-wwam-ink/40 p-8 shadow-glow backdrop-blur-md sm:p-10">
        <div className="absolute -right-8 -top-8 text-wwam-gold/10">
          <CompassMark className="h-40 w-40" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wwam-gold-light">Play log</p>
        <h2 className="font-display mt-2 text-balance text-3xl font-semibold tracking-tight text-wwam-cream sm:text-4xl">
          {campaign.title}
        </h2>
        {campaign.tagline ? (
          <p className="mt-4 max-w-4xl text-lg leading-relaxed text-wwam-cream-muted">{campaign.tagline}</p>
        ) : null}
      </section>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-10">
        {hasSessions ? (
          <aside className="lg:order-0 lg:shrink-0">
            <TurnSidebar turns={sidebarTurns} selectedTurn={selectedTurn} />
          </aside>
        ) : null}

        <div className="min-w-0 flex-1 space-y-10 lg:order-1">
          <Suspense fallback={null}>
            <ScrollToHash />
          </Suspense>
          <section className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h3 className="font-display text-xl font-semibold text-wwam-cream">Where this turn stands</h3>
              <p className="font-mono text-sm text-wwam-gold-light">Turn {selectedTurn}</p>
            </div>
            <TurnProgressGraphic
              full={selectedFull}
              subtitle={
                selectedTurn === latestTurn
                  ? "Current game-turn (latest with entries). Milestones from every session log for this turn are merged."
                  : `Archive view for game-turn ${selectedTurn}. Pick another turn in the sidebar to compare.`
              }
            />
          </section>

          <section className="space-y-5">
            <div>
              <h3 className="font-display text-xl font-semibold text-wwam-cream">What happened</h3>
              <p className="mt-1 max-w-3xl text-sm text-wwam-cream-muted">
                Sessions for <strong className="font-medium text-wwam-cream">turn {selectedTurn}</strong>, newest first.
                Use the sidebar: expand a turn, then pick a session to jump here (or open the whole turn).
              </p>
            </div>
            {hasSessions ? (
              visibleTurnGroups.length > 0 ? (
                <SessionsByTurnAccordion groups={visibleTurnGroups} />
              ) : (
                <p className="rounded-2xl border border-wwam-gold/20 bg-wwam-ink/30 px-5 py-8 text-center text-sm text-wwam-cream-muted backdrop-blur-sm">
                  No sessions recorded for turn {selectedTurn}.
                </p>
              )
            ) : (
              <p className="rounded-2xl border border-wwam-gold/20 bg-wwam-ink/30 px-5 py-8 text-center text-sm text-wwam-cream-muted backdrop-blur-sm">
                No sessions published yet. When the team posts recaps, they’ll show up here.
              </p>
            )}
          </section>
        </div>
      </div>

    </div>
  );
}
