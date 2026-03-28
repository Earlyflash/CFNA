import { prisma } from "@/lib/prisma";
import { aggregateTurn } from "@/lib/turnProgress";
import { TurnProgressGraphic } from "@/components/TurnProgressGraphic";
import { PastTurnsStrip } from "@/components/PastTurnsStrip";
import { SessionList } from "@/components/SessionList";
import { SessionForm } from "@/components/SessionForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
      <p className="text-sand-700">
        No campaign found. Run <code className="rounded bg-sand-200 px-1">npx prisma db push</code> and{" "}
        <code className="rounded bg-sand-200 px-1">npm run db:seed</code>.
      </p>
    );
  }

  const byTurn = new Map<number, typeof campaign.sessionEntries>();
  for (const e of campaign.sessionEntries) {
    const list = byTurn.get(e.gameTurn) ?? [];
    list.push(e);
    byTurn.set(e.gameTurn, list);
  }

  const turnNumbers = [...byTurn.keys()].sort((a, b) => a - b);
  const latestTurn = turnNumbers.length ? Math.max(...turnNumbers) : 1;
  const latestEntries = byTurn.get(latestTurn) ?? [];
  const latestProgress = aggregateTurn(latestEntries, latestTurn);

  const pastTurns = turnNumbers
    .filter((t) => t < latestTurn)
    .map((t) => aggregateTurn(byTurn.get(t) ?? [], t));

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-sand-900">{campaign.title}</h2>
        {campaign.tagline ? <p className="text-sand-700">{campaign.tagline}</p> : null}
      </section>

      <TurnProgressGraphic
        progress={latestProgress}
        subtitle="Shows the latest game-turn that has a session entry. Progress merges Axis and Allied logs for that turn."
      />

      <PastTurnsStrip turns={pastTurns} />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-sand-900">Session log</h2>
        <SessionList entries={campaign.sessionEntries} />
      </section>

      <SessionForm campaignId={campaign.id} defaultGameTurn={latestTurn} />
    </div>
  );
}
