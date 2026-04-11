import Link from "next/link";
import type { SessionEntry } from "@prisma/client";
import { DeleteSessionForm } from "@/components/DeleteSessionForm";

type Entry = Pick<
  SessionEntry,
  "id" | "campaignId" | "episodeNumber" | "gameTurn" | "playedAt" | "title" | "publishedBy"
> & {
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
      <p className="text-sm italic text-np-ink-muted">
        No sessions yet. Use{" "}
        <Link href="/publish/new" className="font-semibold text-np-red underline underline-offset-2 hover:text-np-red-light">
          Publish a new session log
        </Link>{" "}
        above to add the first entry.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-np-rule-light">
      {entries.map((e) => (
        <li
          key={e.id}
          className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs text-np-ink-muted">
              Ep {e.episodeNumber} &middot; Turn {e.gameTurn} &middot; {formatWhen(e.playedAt)}
              {e.publishedBy ? ` \u00B7 by ${e.publishedBy}` : ""}
              {e._count.images > 0 ? ` \u00B7 ${e._count.images} img` : ""}
            </p>
            <p className="mt-1 font-semibold text-np-ink line-clamp-2">{e.title}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link
              href={`/publish/edit/${e.id}`}
              className="border border-np-rule px-3 py-1.5 text-xs font-semibold text-np-ink-light transition hover:border-np-ink hover:text-np-ink"
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
