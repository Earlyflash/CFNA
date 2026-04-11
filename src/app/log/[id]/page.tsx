import Link from "next/link";
import { notFound } from "next/navigation";
import { SessionEntryCard } from "@/components/SessionEntryCard";
import { TurnProgressGraphic } from "@/components/TurnProgressGraphic";
import { aggregateFullTurn, sessionCheckedFlowKeys } from "@/lib/turnProgress";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const entry = await prisma.sessionEntry.findUnique({
    where: { id },
    select: { title: true },
  });
  if (!entry) return { title: "Episode not found" };
  return { title: `${entry.title} · Episode log` };
}

export default async function EpisodeLogPage({ params }: PageProps) {
  const { id } = await params;

  const entry = await prisma.sessionEntry.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!entry) notFound();

  const turnEntries = await prisma.sessionEntry.findMany({
    where: { campaignId: entry.campaignId, gameTurn: entry.gameTurn },
    orderBy: { playedAt: "desc" },
  });

  const fullTurn = aggregateFullTurn(turnEntries, entry.gameTurn);
  const sessionHighlightKeys = sessionCheckedFlowKeys(entry);

  const backHref = `/?turn=${entry.gameTurn}#session-${entry.id}`;

  return (
    <div className="flex min-h-[calc(100dvh-10rem)] flex-col">
      <nav
        className="sticky top-0 z-10 -mx-4 mb-6 border-b-2 border-np-ink bg-np-paper px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10"
        aria-label="Episode navigation"
      >
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-np-ink transition hover:text-np-red"
        >
          <span aria-hidden>&larr;</span>
          Back to play log
          <span className="font-mono text-xs font-normal text-np-ink-muted">
            (turn {entry.gameTurn}, ep {entry.episodeNumber})
          </span>
        </Link>
      </nav>

      <div className="space-y-8">
        <section aria-labelledby="episode-graphic-heading">
          <h1 id="episode-graphic-heading" className="sr-only">
            Turn {entry.gameTurn} progress for this episode
          </h1>
          <TurnProgressGraphic
            full={fullTurn}
            sessionHighlightKeys={sessionHighlightKeys}
            subtitle={`Dispatch "${entry.title}" — merged turn progress below; red marks what this log checked off.`}
          />
        </section>

        <section aria-labelledby="episode-body-heading">
          <h2 id="episode-body-heading" className="sr-only">
            Session recap
          </h2>
          <SessionEntryCard entry={entry} showTurnBadge showFullViewLink={false} />
        </section>
      </div>
    </div>
  );
}
