import Link from "next/link";
import { redirect } from "next/navigation";
import { getPublisherUsername } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { peerProgressByTurnFromEntries } from "@/lib/turnProgress";
import { SessionForm } from "@/components/SessionForm";

export const metadata = {
  title: "New session log · War With A Mate",
};

export const dynamic = "force-dynamic";

export default async function PublishNewSessionPage() {
  const user = await getPublisherUsername();
  if (!user) redirect("/publish/login");

  const campaign = await prisma.campaign.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!campaign) {
    return (
      <p className="text-np-ink-muted">
        No campaign in database. Run <code className="font-mono text-np-red">npx prisma db push</code> and{" "}
        <code className="font-mono text-np-red">npm run db:seed</code>.
      </p>
    );
  }

  const maxAgg = await prisma.sessionEntry.aggregate({ _max: { gameTurn: true } });
  const latestTurn = maxAgg._max.gameTurn ?? 1;

  const sessionEntryCount = await prisma.sessionEntry.count();
  const maxEpAgg = await prisma.sessionEntry.aggregate({
    _max: { episodeNumber: true },
  });
  const nextEpisodeNumber =
    maxEpAgg._max.episodeNumber != null
      ? maxEpAgg._max.episodeNumber + 1
      : sessionEntryCount + 1;

  const entriesForPeer = await prisma.sessionEntry.findMany({
    where: { campaignId: campaign.id },
  });
  const peerProgressByTurn = peerProgressByTurnFromEntries(entriesForPeer);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link
          href="/publish"
          className="font-semibold text-np-ink underline underline-offset-2 hover:text-np-red"
        >
          &larr; Back to published sessions
        </Link>
        <span className="text-np-rule">&middot;</span>
        <Link href="/" className="text-np-ink-muted underline-offset-2 hover:text-np-ink hover:underline">
          View public log
        </Link>
      </div>

      <div className="border border-np-rule bg-np-paper p-6 shadow-print sm:p-8">
        <SessionForm
          key={`publish-new-${sessionEntryCount}`}
          campaignId={campaign.id}
          defaultGameTurn={latestTurn}
          nextEpisodeNumber={nextEpisodeNumber}
          variant="publish"
          peerProgressByTurn={peerProgressByTurn}
        />
      </div>
    </div>
  );
}
