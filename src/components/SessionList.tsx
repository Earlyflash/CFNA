import Image from "next/image";
import type { SessionEntry, SessionImage, SessionSide } from "@prisma/client";

export type EntryWithImages = SessionEntry & { images: SessionImage[] };

function sideStyles(side: SessionSide) {
  if (side === "ALLIED") return "bg-allied-soft text-allied border-allied/30";
  return "bg-axis-soft text-axis border-axis/30";
}

function sideLabel(side: SessionSide) {
  return side === "ALLIED" ? "Allied" : "Axis";
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

function milestones(e: SessionEntry): string[] {
  const out: string[] = [];
  if (e.doneInitiative) out.push("Initiative");
  if (e.doneNaval) out.push("Naval");
  if (e.doneOpStage1) out.push("OS1");
  if (e.doneOpStage2) out.push("OS2");
  if (e.doneOpStage3) out.push("OS3");
  return out;
}

export function SessionList({ entries }: { entries: EntryWithImages[] }) {
  if (!entries.length) {
    return <p className="text-sm text-sand-600">No sessions yet — add the first entry below.</p>;
  }

  return (
    <ul className="space-y-6">
      {entries.map((e) => (
        <li
          key={e.id}
          className="rounded-2xl border border-sand-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span
                className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${sideStyles(e.side)}`}
              >
                {sideLabel(e.side)}
              </span>
              <span className="ml-2 font-mono text-sm text-sand-600">Turn {e.gameTurn}</span>
              <h3 className="mt-2 text-lg font-semibold text-sand-900">{e.title}</h3>
              <p className="mt-1 text-xs text-sand-500">{formatDate(e.playedAt)}</p>
            </div>
            {milestones(e).length ? (
              <ul className="flex flex-wrap gap-1">
                {milestones(e).map((m) => (
                  <li
                    key={m}
                    className="rounded-md bg-sand-100 px-2 py-0.5 font-mono text-xs text-sand-800"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-sand-800">{e.summary}</p>
          {e.podcastUrl ? (
            <p className="mt-3 text-sm">
              <a
                href={e.podcastUrl}
                className="font-medium text-allied hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                Listen →
              </a>
              {e.podcastNote ? <span className="text-sand-600"> — {e.podcastNote}</span> : null}
            </p>
          ) : e.podcastNote ? (
            <p className="mt-3 text-sm text-sand-600">{e.podcastNote}</p>
          ) : null}
          {e.images.length ? (
            <ul className="mt-4 flex flex-wrap gap-3">
              {e.images.map((img) => (
                <li key={img.id} className="relative h-40 w-52 overflow-hidden rounded-lg border border-sand-200 bg-sand-100">
                  <Image
                    src={img.url}
                    alt={img.originalName}
                    fill
                    className="object-cover"
                    sizes="208px"
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
