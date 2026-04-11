"use client";

import Image from "next/image";
import Link from "next/link";
import type { SessionEntry, SessionImage } from "@prisma/client";
import { SecretNotesReveal } from "@/components/SecretNotesReveal";
import { SessionFlowMilestoneDots } from "@/components/SessionFlowMilestoneDots";

export type EntryWithImages = SessionEntry & { images: SessionImage[] };

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

type Props = {
  entry: EntryWithImages;
  showTurnBadge?: boolean;
  showFullViewLink?: boolean;
};

export function SessionEntryCard({ entry: e, showTurnBadge = true, showFullViewLink = true }: Props) {
  return (
    <article className="border-t-2 border-np-ink pt-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-np-ink-muted">
              Dispatch
            </span>
            {showTurnBadge ? (
              <span className="font-mono text-xs text-np-ink-muted">
                Turn {e.gameTurn} &middot; Ep {e.episodeNumber}
              </span>
            ) : null}
          </div>

          {showFullViewLink ? (
            <Link
              href={`/log/${e.id}`}
              className="group/ep mt-1 block outline-none focus-visible:ring-2 focus-visible:ring-np-ink focus-visible:ring-offset-2 focus-visible:ring-offset-np-paper"
            >
              <h3 className="font-display text-xl font-bold text-np-ink underline-offset-2 transition group-hover/ep:underline sm:text-2xl">
                {e.title}
              </h3>
            </Link>
          ) : (
            <h3 className="font-display mt-1 text-xl font-bold text-np-ink sm:text-2xl">{e.title}</h3>
          )}

          <p className="mt-1 text-xs italic text-np-ink-muted">
            {formatDate(e.playedAt)}
            {e.publishedBy ? (
              <>
                {" "}
                &mdash; by <span className="font-semibold not-italic text-np-ink-light">{e.publishedBy}</span>
              </>
            ) : null}
          </p>
        </div>
        <SessionFlowMilestoneDots entry={e} />
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-np-ink-light">{e.summary}</p>

      {e.secretNotesAxis?.trim() || e.secretNotesAllies?.trim() ? (
        <div className="mt-4 flex flex-col gap-3">
          <SecretNotesReveal text={e.secretNotesAxis} idPrefix={`${e.id}-axis`} side="axis" />
          <SecretNotesReveal text={e.secretNotesAllies} idPrefix={`${e.id}-allies`} side="allies" />
        </div>
      ) : null}

      {e.podcastUrl ? (
        <p className="mt-3 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-wider text-np-ink-muted">See also: </span>
          <a
            href={e.podcastUrl}
            className="font-semibold text-np-red underline underline-offset-2 hover:text-np-red-light"
            rel="noopener noreferrer"
            target="_blank"
          >
            Listen to episode &#8599;
          </a>
          {e.podcastNote ? <span className="text-np-ink-muted"> &mdash; {e.podcastNote}</span> : null}
        </p>
      ) : e.podcastNote ? (
        <p className="mt-3 text-sm italic text-np-ink-muted">{e.podcastNote}</p>
      ) : null}

      {e.images.length ? (
        <ul className="mt-4 flex flex-wrap gap-4">
          {e.images.map((img) => (
            <li
              key={img.id}
              className="relative h-40 w-56 overflow-hidden border border-np-ink bg-np-paper-dark shadow-print"
            >
              <Image
                src={img.url}
                alt={img.originalName}
                fill
                className="object-cover"
                sizes="224px"
              />
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
