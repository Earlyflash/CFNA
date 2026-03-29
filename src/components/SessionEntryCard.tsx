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
  /** Hide the inline “Turn n” line when the parent already shows the turn (e.g. accordion). */
  showTurnBadge?: boolean;
  /** Title links to full episode view (off on `/log/[id]`). */
  showFullViewLink?: boolean;
};

export function SessionEntryCard({ entry: e, showTurnBadge = true, showFullViewLink = true }: Props) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-wwam-gold/20 bg-wwam-card/95 shadow-lg shadow-black/20 backdrop-blur-sm">
      <div
        className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-axis via-wwam-gold to-allied"
        aria-hidden
      />
      <div className="p-6 pl-7 sm:p-8 sm:pl-10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-full border border-wwam-gold/35 bg-wwam-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-wwam-ink">
              Episode log
            </span>
            {showTurnBadge ? (
              <span className="ml-2 font-mono text-sm font-medium text-wwam-dune">
                Turn {e.gameTurn} · Ep {e.episodeNumber}
              </span>
            ) : null}
            {showFullViewLink ? (
              <Link
                href={`/log/${e.id}`}
                className="group/ep mt-3 block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-wwam-gold focus-visible:ring-offset-2 focus-visible:ring-offset-wwam-card"
              >
                <h3 className="font-display text-xl font-semibold text-wwam-ink underline-offset-4 transition group-hover/ep:text-allied group-hover/ep:underline sm:text-2xl">
                  {e.title}
                </h3>
              </Link>
            ) : (
              <h3 className="font-display mt-3 text-xl font-semibold text-wwam-ink sm:text-2xl">{e.title}</h3>
            )}
            <p className="mt-1 text-xs font-medium text-wwam-dune">
              {formatDate(e.playedAt)}
              {e.publishedBy ? (
                <>
                  {" "}
                  · by <span className="text-wwam-ink/80">{e.publishedBy}</span>
                </>
              ) : null}
            </p>
          </div>
          <SessionFlowMilestoneDots entry={e} />
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-wwam-ink/90">{e.summary}</p>
        {e.secretNotesAxis?.trim() || e.secretNotesAllies?.trim() ? (
          <div className="mt-5 flex flex-col gap-4">
            <SecretNotesReveal
              text={e.secretNotesAxis}
              idPrefix={`${e.id}-axis`}
              side="axis"
            />
            <SecretNotesReveal
              text={e.secretNotesAllies}
              idPrefix={`${e.id}-allies`}
              side="allies"
            />
          </div>
        ) : null}
        {e.podcastUrl ? (
          <p className="mt-4 text-sm">
            <a
              href={e.podcastUrl}
              className="inline-flex items-center gap-1 font-semibold text-allied underline-offset-2 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Open episode
              <span aria-hidden>↗</span>
            </a>
            {e.podcastNote ? <span className="text-wwam-dune"> — {e.podcastNote}</span> : null}
          </p>
        ) : e.podcastNote ? (
          <p className="mt-4 text-sm text-wwam-dune">{e.podcastNote}</p>
        ) : null}
        {e.images.length ? (
          <ul className="mt-6 flex flex-wrap gap-4">
            {e.images.map((img) => (
              <li
                key={img.id}
                className="relative h-44 w-60 overflow-hidden rounded-2xl border border-wwam-gold/25 bg-wwam-cream/50 shadow-inner"
              >
                <Image
                  src={img.url}
                  alt={img.originalName}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  sizes="240px"
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
