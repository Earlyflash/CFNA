import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { aggregateFullTurn } from "@/lib/turnProgress";
import { TurnProgressGraphic } from "@/components/TurnProgressGraphic";
import { TurnSidebar, type TurnNavItem } from "@/components/TurnSidebar";
import { SessionsByTurnAccordion, type TurnSessionGroup } from "@/components/SessionsByTurnAccordion";
import { ScrollToHash } from "@/components/ScrollToHash";
import { OrnamentalRule } from "@/components/OrnamentalRule";
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
      <p className="border border-np-rule p-6 text-np-ink-muted">
        No campaign found. Run <code className="font-mono text-np-red">npx prisma db push</code> and{" "}
        <code className="font-mono text-np-red">npm run db:seed</code>.
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
        publishedBy: e.publishedBy ?? null,
      })),
    };
  });

  const allTurnGroups: TurnSessionGroup[] = turnNumbers.map((t) => {
    const sessions = sortSessionsByNewestFirst(byTurn.get(t) ?? []);
    return { turn: t, sessions };
  });

  const visibleTurnGroups = allTurnGroups.filter((g) => g.turn === selectedTurn);

  const hasSessions = campaign.sessionEntries.length > 0;

  return (
    <div className="space-y-8">
      {/* Above the fold */}
      <section className="border-b-3 border-double border-np-ink pb-6 text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-np-ink-muted">
          Latest Dispatches
        </p>
        <h2 className="font-display mt-2 text-balance text-3xl font-black uppercase tracking-tight text-np-ink sm:text-4xl lg:text-5xl">
          {campaign.title}
        </h2>
        {campaign.tagline ? (
          <p className="mx-auto mt-3 max-w-3xl text-lg italic leading-relaxed text-np-ink-light">{campaign.tagline}</p>
        ) : null}
        <div className="mx-auto mt-4 flex items-center justify-center gap-3 font-mono text-sm text-np-ink-muted">
          <span className="h-px w-12 bg-np-rule" />
          <span>Turn {selectedTurn} {selectedTurn === latestTurn ? "(Current)" : "(Archive)"}</span>
          <span className="h-px w-12 bg-np-rule" />
        </div>
      </section>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
        {hasSessions ? (
          <aside className="lg:order-0 lg:shrink-0">
            <TurnSidebar turns={sidebarTurns} selectedTurn={selectedTurn} />
          </aside>
        ) : null}

        <div className="min-w-0 flex-1 space-y-8 lg:order-1">
          <Suspense fallback={null}>
            <ScrollToHash />
          </Suspense>

          <section className="space-y-3">
            <div className="border-b-2 border-np-ink pb-1">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-np-ink sm:text-xl">
                War Situation &mdash; Turn {selectedTurn}
              </h3>
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

          <OrnamentalRule />

          <section className="space-y-4">
            <div className="border-b-2 border-np-ink pb-1">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-np-ink sm:text-xl">
                Field Dispatches
              </h3>
            </div>
            <p className="text-sm text-np-ink-muted">
              Sessions for <strong className="font-semibold text-np-ink">turn {selectedTurn}</strong>, newest first.
              Expand a turn in the index to see sessions or jump to a specific dispatch.
            </p>
            {hasSessions ? (
              visibleTurnGroups.length > 0 ? (
                <SessionsByTurnAccordion groups={visibleTurnGroups} />
              ) : (
                <p className="border border-np-rule px-5 py-8 text-center text-sm italic text-np-ink-muted">
                  No sessions recorded for turn {selectedTurn}.
                </p>
              )
            ) : (
              <p className="border border-np-rule px-5 py-8 text-center text-sm italic text-np-ink-muted">
                No sessions published yet. When the team posts recaps, they&apos;ll appear here.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
