import Link from "next/link";
import type { SessionEntry } from "@prisma/client";
import { DeleteSessionForm } from "@/components/DeleteSessionForm";

/** List row: metadata + image count (no image blobs loaded). */
type Entry = Pick<SessionEntry, "id" | "campaignId" | "episodeNumber" | "gameTurn" | "playedAt" | "title"> & {
  _count: { images: number };
};

function formatWhen(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

type Props = {
  campaignId: string;
  entries: Entry[];
};

export function PublisherSessionsList({ campaignId, entries }: Props) {
  if (!entries.length) {
    return (
      <p className="text-sm text-wwam-cream-muted">
        No sessions yet. Use{" "}
        <Link href="/publish/new" className="font-medium text-wwam-gold-light underline-offset-2 hover:underline">
          Publish a new session log
        </Link>{" "}
        above to add the first entry.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {entries.map((e) => (
        <li
          key={e.id}
          className="flex flex-col gap-3 rounded-xl border border-wwam-gold/20 bg-wwam-ink/40 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs text-wwam-gold-light">
              Ep {e.episodeNumber} · Turn {e.gameTurn} · {formatWhen(e.playedAt)}
              {e._count.images > 0 ? ` · ${e._count.images} img` : ""}
            </p>
            <p className="mt-1 font-medium text-wwam-cream line-clamp-2">{e.title}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link
              href={`/publish/edit/${e.id}`}
              className="rounded-lg border border-wwam-gold/35 bg-wwam-gold/10 px-3 py-1.5 text-xs font-medium text-wwam-gold-light transition hover:bg-wwam-gold/20"
            >
              Edit
            </Link>
            <DeleteSessionForm entryId={e.id} campaignId={campaignId} title={e.title} />
          </div>
        </li>
      ))}
    </ul>
  );
}
