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
        className="sticky top-0 z-10 -mx-4 mb-8 border-b border-wwam-gold/25 bg-wwam-void/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10"
        aria-label="Episode navigation"
      >
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-wwam-gold-light transition hover:text-wwam-cream"
        >
          <span aria-hidden>←</span>
          Back to play log
          <span className="font-mono text-xs font-normal text-wwam-cream-muted">
            (turn {entry.gameTurn}, ep {entry.episodeNumber})
          </span>
        </Link>
      </nav>

      <div className="space-y-10">
        <section aria-labelledby="episode-graphic-heading">
          <h1 id="episode-graphic-heading" className="sr-only">
            Turn {entry.gameTurn} progress for this episode
          </h1>
          <TurnProgressGraphic
            full={fullTurn}
            sessionHighlightKeys={sessionHighlightKeys}
            subtitle={`Episode “${entry.title}” — merged turn progress below; red marks what this log checked off.`}
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
