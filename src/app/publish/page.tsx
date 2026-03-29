import Link from "next/link";
import { redirect } from "next/navigation";
import { getPublisherUsername } from "@/lib/auth";
import { logoutPublisher } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { PublisherSessionsList } from "@/components/PublisherSessionsList";

export const metadata = {
  title: "Publisher · War With A Mate",
};

export const dynamic = "force-dynamic";

export default async function PublishPage() {
  const user = await getPublisherUsername();
  if (!user) redirect("/publish/login");

  const campaign = await prisma.campaign.findFirst({
    orderBy: { createdAt: "asc" },
    include: {
      sessionEntries: {
        orderBy: [{ playedAt: "desc" }, { episodeNumber: "desc" }],
        select: {
          id: true,
          campaignId: true,
          episodeNumber: true,
          gameTurn: true,
          playedAt: true,
          title: true,
          _count: { select: { images: true } },
        },
      },
    },
  });

  if (!campaign) {
    return (
      <p className="text-wwam-cream-muted">
        No campaign in database. Run <code className="text-wwam-gold">npx prisma db push</code> and{" "}
        <code className="text-wwam-gold">npm run db:seed</code>.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-wwam-gold/20 bg-wwam-ink/60 px-5 py-4 backdrop-blur-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-wwam-gold">Publishing</p>
          <p className="text-sm text-wwam-cream-muted">
            Signed in as <span className="font-medium text-wwam-cream">{user}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="rounded-full border border-wwam-cream/20 px-4 py-2 text-sm text-wwam-cream-muted transition hover:border-wwam-cream/40 hover:text-wwam-cream"
          >
            View public log
          </Link>
          <form action={logoutPublisher}>
            <button
              type="submit"
              className="rounded-full border border-wwam-gold/40 bg-wwam-gold/10 px-4 py-2 text-sm font-medium text-wwam-gold-light transition hover:bg-wwam-gold/20"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="space-y-2">
        <Link
          href="/publish/new"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-wwam-gold/50 bg-gradient-to-r from-wwam-gold/25 to-wwam-gold/10 px-4 py-3 text-center text-sm font-semibold text-wwam-cream shadow-md shadow-black/20 transition hover:border-wwam-gold-light/60 hover:from-wwam-gold/35 hover:to-wwam-gold/15 sm:w-auto sm:px-6"
        >
          <span className="text-lg leading-none" aria-hidden>
            +
          </span>
          Publish a new session log
        </Link>
        <p className="text-[11px] leading-snug text-wwam-cream-muted/90">
          Opens the full form: title, summary, milestones, strategist notes, images — on its own page.
        </p>
      </div>

      <section className="rounded-2xl border border-wwam-gold/20 bg-wwam-ink/40 px-5 py-5 backdrop-blur-sm">
        <h2 className="font-display text-lg font-semibold text-wwam-cream">Published sessions</h2>
        <p className="mt-1 text-xs text-wwam-cream-muted">
          Newest first. Edit to change text, milestones, or images; delete removes files from disk.
        </p>

        <div className="mt-4">
          <PublisherSessionsList campaignId={campaign.id} entries={campaign.sessionEntries} />
        </div>
      </section>
    </div>
  );
}
