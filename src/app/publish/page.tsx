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
          publishedBy: true,
          _count: { select: { images: true } },
        },
      },
    },
  });

  if (!campaign) {
    return (
      <p className="text-np-ink-muted">
        No campaign in database. Run <code className="font-mono text-np-red">npx prisma db push</code> and{" "}
        <code className="font-mono text-np-red">npm run db:seed</code>.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-np-ink bg-np-paper px-5 py-4">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-np-ink-muted">Publishing</p>
          <p className="text-sm text-np-ink-light">
            Signed in as <span className="font-semibold text-np-ink">{user}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="border border-np-rule px-4 py-2 text-sm text-np-ink-light transition hover:border-np-ink hover:text-np-ink"
          >
            View public log
          </Link>
          <form action={logoutPublisher}>
            <button
              type="submit"
              className="border border-np-ink bg-np-ink px-4 py-2 text-sm font-semibold text-np-paper transition hover:bg-np-ink-light"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="space-y-2">
        <Link
          href="/publish/new"
          className="inline-flex w-full items-center justify-center gap-2 border-2 border-np-ink bg-np-ink px-4 py-3 text-center text-sm font-bold uppercase tracking-wider text-np-paper shadow-print transition hover:bg-np-ink-light sm:w-auto sm:px-6"
        >
          <span className="text-lg leading-none" aria-hidden>+</span>
          Publish a new session log
        </Link>
        <p className="text-[11px] leading-snug text-np-ink-muted">
          Opens the full form: title, summary, milestones, strategist notes, images &mdash; on its own page.
        </p>
      </div>

      <section className="border border-np-rule bg-np-paper px-5 py-5">
        <h2 className="font-display text-lg font-bold text-np-ink">Published Sessions</h2>
        <p className="mt-1 text-xs text-np-ink-muted">
          Newest first. Edit to change text, milestones, or images; delete removes files from disk.
        </p>

        <div className="mt-4">
          <PublisherSessionsList campaignId={campaign.id} entries={campaign.sessionEntries} />
        </div>
      </section>
    </div>
  );
}
