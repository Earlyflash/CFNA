import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { SessionEntry, SessionImage } from "@prisma/client";
import { getPublisherUsername } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { peerProgressByTurnFromEntries } from "@/lib/turnProgress";
import { SessionForm, type SessionEditInitial } from "@/components/SessionForm";

type EntryWithImages = SessionEntry & { images: SessionImage[] };

export const metadata = {
  title: "Edit session · War With A Mate",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

function toEditInitial(entry: EntryWithImages): SessionEditInitial {
  return {
    id: entry.id,
    gameTurn: entry.gameTurn,
    playedAt: entry.playedAt.toISOString(),
    title: entry.title,
    summary: entry.summary,
    podcastUrl: entry.podcastUrl,
    podcastNote: entry.podcastNote,
    episodeNumber: entry.episodeNumber,
    secretNotesAxis: entry.secretNotesAxis,
    secretNotesAllies: entry.secretNotesAllies,
    doneInitiative: entry.doneInitiative,
    doneNaval: entry.doneNaval,
    doneOpStage1: entry.doneOpStage1,
    doneOpStage2: entry.doneOpStage2,
    doneOpStage3: entry.doneOpStage3,
    doneAirStrategic: entry.doneAirStrategic,
    doneAirConvoy: entry.doneAirConvoy,
    doneAirLandOs1: entry.doneAirLandOs1,
    doneAirLandOs2: entry.doneAirLandOs2,
    doneAirLandOs3: entry.doneAirLandOs3,
    doneLogisticsStores: entry.doneLogisticsStores,
    doneLogisticsWaterAttrition: entry.doneLogisticsWaterAttrition,
    doneLogisticsSupplyOs1: entry.doneLogisticsSupplyOs1,
    doneLogisticsSupplyOs2: entry.doneLogisticsSupplyOs2,
    doneLogisticsSupplyOs3: entry.doneLogisticsSupplyOs3,
    images: entry.images.map((img) => ({
      id: img.id,
      url: img.url,
      originalName: img.originalName,
    })),
  };
}

export default async function EditSessionPage({ params }: PageProps) {
  const user = await getPublisherUsername();
  if (!user) redirect("/publish/login");

  const { id } = await params;

  const campaign = await prisma.campaign.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!campaign) {
    return (
      <p className="text-wwam-cream-muted">
        No campaign in database. Run <code className="text-wwam-gold">npx prisma db push</code> and{" "}
        <code className="text-wwam-gold">npm run db:seed</code>.
      </p>
    );
  }

  const entry = await prisma.sessionEntry.findFirst({
    where: { id, campaignId: campaign.id },
    include: { images: true },
  });

  if (!entry) notFound();

  const maxAgg = await prisma.sessionEntry.aggregate({ _max: { gameTurn: true } });
  const latestTurn = maxAgg._max.gameTurn ?? 1;

  const maxEpAgg = await prisma.sessionEntry.aggregate({
    _max: { episodeNumber: true },
  });
  const sessionEntryCount = await prisma.sessionEntry.count();
  const nextEpisodeNumber =
    maxEpAgg._max.episodeNumber != null
      ? maxEpAgg._max.episodeNumber + 1
      : sessionEntryCount + 1;

  const editEntry = toEditInitial(entry);

  const allEntries = await prisma.sessionEntry.findMany({
    where: { campaignId: campaign.id },
  });
  const peerProgressByTurn = peerProgressByTurnFromEntries(allEntries, entry.id);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link
          href="/publish"
          className="font-medium text-wwam-gold-light underline-offset-2 hover:underline"
        >
          ← Back to publish
        </Link>
        <span className="text-wwam-cream-muted">·</span>
        <Link href="/" className="text-wwam-cream-muted underline-offset-2 hover:text-wwam-cream hover:underline">
          View public log
        </Link>
      </div>

      <div className="rounded-3xl border border-wwam-gold/15 bg-wwam-card p-6 shadow-xl shadow-black/20 sm:p-8">
        <SessionForm
          key={entry.id}
          campaignId={campaign.id}
          defaultGameTurn={latestTurn}
          nextEpisodeNumber={nextEpisodeNumber}
          variant="publish"
          editEntry={editEntry}
          peerProgressByTurn={peerProgressByTurn}
        />
      </div>
    </div>
  );
}
