"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { createSessionEntry, updateSessionEntry } from "@/app/actions";
import { podcastDetailSuffix } from "@/lib/sessionFormParse";
import type { FullTurnProgress } from "@/lib/turnProgress";
import { sessionCheckedFlowKeys, TURN_FLOW_MILESTONES } from "@/lib/turnProgress";
import { PublisherStrategistNotesField } from "@/components/PublisherStrategistNotesField";
import { SessionTurnFlowPicker } from "@/components/SessionTurnFlowPicker";

/** `datetime-local` value in the user's local timezone (no seconds). */
function formatDatetimeLocal(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function SubmitButton({ variant, isEdit }: { variant: "default" | "publish"; isEdit: boolean }) {
  const { pending } = useFormStatus();
  const cls =
    variant === "publish"
      ? "rounded-xl bg-gradient-to-r from-wwam-ink to-wwam-void px-5 py-3 text-sm font-semibold text-wwam-cream shadow-lg shadow-black/20 ring-1 ring-wwam-gold/30 hover:brightness-110 disabled:opacity-60"
      : "rounded-lg bg-sand-900 px-4 py-2.5 text-sm font-medium text-sand-50 hover:bg-sand-800 disabled:opacity-60";
  const label = pending ? "Saving…" : isEdit ? "Save changes" : "Publish session log";
  return (
    <button type="submit" disabled={pending} className={cls}>
      {label}
    </button>
  );
}

export type SessionEditInitial = {
  id: string;
  gameTurn: number;
  playedAt: string;
  title: string;
  summary: string;
  podcastUrl: string | null;
  podcastNote: string | null;
  episodeNumber: number;
  secretNotesAxis: string | null;
  secretNotesAllies: string | null;
  doneInitiative: boolean;
  doneNaval: boolean;
  doneOpStage1: boolean;
  doneOpStage2: boolean;
  doneOpStage3: boolean;
  doneAirStrategic: boolean;
  doneAirConvoy: boolean;
  doneAirLandOs1: boolean;
  doneAirLandOs2: boolean;
  doneAirLandOs3: boolean;
  doneLogisticsStores: boolean;
  doneLogisticsWaterAttrition: boolean;
  doneLogisticsSupplyOs1: boolean;
  doneLogisticsSupplyOs2: boolean;
  doneLogisticsSupplyOs3: boolean;
  images: { id: string; url: string; originalName: string }[];
};

type Props = {
  campaignId: string;
  defaultGameTurn: number;
  /** Next episode index when creating (max episode + 1). */
  nextEpisodeNumber?: number;
  variant?: "default" | "publish";
  /** When set, form updates this entry instead of creating. */
  editEntry?: SessionEditInitial | null;
  /** Per-turn aggregate from other session logs (exclude current entry when editing). */
  peerProgressByTurn?: Record<number, FullTurnProgress>;
};

export function SessionForm({
  campaignId,
  defaultGameTurn,
  nextEpisodeNumber = 1,
  variant = "default",
  editEntry = null,
  peerProgressByTurn = {},
}: Props) {
  const isEdit = Boolean(editEntry);
  const [playedAt, setPlayedAt] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState(nextEpisodeNumber);
  const [podcastNoteSuffix, setPodcastNoteSuffix] = useState("");
  const [gameTurn, setGameTurn] = useState(() => editEntry?.gameTurn ?? defaultGameTurn);

  useEffect(() => {
    if (editEntry) {
      setPlayedAt(formatDatetimeLocal(new Date(editEntry.playedAt)));
      setEpisodeNumber(editEntry.episodeNumber);
      setPodcastNoteSuffix(podcastDetailSuffix(editEntry.podcastNote, editEntry.episodeNumber));
      setGameTurn(editEntry.gameTurn);
    } else {
      setPlayedAt(formatDatetimeLocal(new Date()));
      setEpisodeNumber(nextEpisodeNumber);
      setPodcastNoteSuffix("");
      setGameTurn(defaultGameTurn);
    }
  }, [editEntry, nextEpisodeNumber, defaultGameTurn]);

  const isPub = variant === "publish";
  const formShell = isPub
    ? "space-y-6"
    : "space-y-6 rounded-2xl border border-sand-200 bg-white p-6 shadow-sm";

  const label = isPub ? "font-medium text-wwam-ink" : "font-medium text-sand-800";
  const field = isPub
    ? "mt-1 w-full rounded-xl border border-wwam-gold/25 bg-white px-3 py-2.5 text-wwam-ink placeholder:text-wwam-dune/60 focus:border-wwam-gold focus:outline-none focus:ring-1 focus:ring-wwam-gold"
    : "mt-1 w-full rounded-lg border border-sand-300 px-3 py-2 text-sand-900";
  const sub = isPub ? "text-sm text-wwam-dune" : "text-sm text-sand-600";
  const titleC = isPub ? "text-lg font-semibold text-wwam-ink font-display" : "text-lg font-semibold text-sand-900";
  const fs = isPub
    ? "rounded-xl border border-wwam-gold/20 bg-wwam-cream/40 p-4"
    : "rounded-xl border border-sand-200 bg-sand-50/80 p-4";
  const leg = isPub ? "px-1 text-sm font-medium text-wwam-ink" : "px-1 text-sm font-medium text-sand-800";
  const cb = isPub ? "text-sm text-wwam-ink" : "text-sm text-sand-800";
  const fileIn = isPub
    ? "mt-1 block w-full text-sm text-wwam-dune file:mr-3 file:rounded-lg file:border-0 file:bg-wwam-gold/20 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-wwam-ink hover:file:bg-wwam-gold/30"
    : "mt-1 block w-full text-sm text-sand-700 file:mr-3 file:rounded-lg file:border-0 file:bg-sand-200 file:px-3 file:py-2 file:text-sm file:font-medium file:text-sand-900 hover:file:bg-sand-300";

  const formAction = isEdit ? updateSessionEntry : createSessionEntry;

  return (
    <form action={formAction} className={formShell}>
      <input type="hidden" name="campaignId" value={campaignId} />
      {isEdit ? <input type="hidden" name="entryId" value={editEntry!.id} /> : null}

      <div>
        <h2 className={titleC}>{isEdit ? "Edit session entry" : "New session entry"}</h2>
        <p className={`mt-1 ${sub}`}>
          {isEdit
            ? "Update this log entry; changes appear on the public site after you save."
            : "One entry per recording: cover both sides’ moves and stages for that sitting. Milestones you check off merge into the public turn graphic for that game-turn."}
        </p>
      </div>

      <label className="block text-sm sm:max-w-xs">
        <span className={label}>Game-turn #</span>
        <input
          name="gameTurn"
          type="number"
          min={1}
          value={gameTurn}
          onChange={(e) => setGameTurn(Math.max(1, parseInt(e.target.value, 10) || 1))}
          className={`${field} font-mono`}
          required
        />
      </label>

      <label className="block text-sm">
        <span className={label}>Session date</span>
        <input
          name="playedAt"
          type="datetime-local"
          className={field}
          value={playedAt}
          onChange={(e) => setPlayedAt(e.target.value)}
        />
      </label>

      <label className="block text-sm">
        <span className={label}>Title</span>
        <input
          name="title"
          type="text"
          placeholder="e.g. Turn 4 — Ep 12: Ops Stage 1 movement & combat (both sides)"
          className={field}
          required
          defaultValue={editEntry?.title ?? ""}
        />
      </label>

      <label className="block text-sm">
        <span className={label}>Summary</span>
        <textarea
          name="summary"
          rows={5}
          placeholder="What happened at the table, what you’ll resume next time, notable dice or rule lookups…"
          className={field}
          required
          defaultValue={editEntry?.summary ?? ""}
        />
      </label>

      {isPub ? (
        <>
          <PublisherStrategistNotesField
            side="axis"
            name="secretNotesAxis"
            legend="Axis strategist notes (optional)"
            hint="Axis-only planning, hunches, or experiments. On the public log this side is still behind its own Reveal. Not encrypted."
            placeholder="e.g. Dummy stack near the wire — rules check next time…"
            initialValue={editEntry?.secretNotesAxis ?? ""}
            fieldClass={field}
            subClass={sub}
            legClass={leg}
            resetKey={editEntry?.id ?? "create"}
          />
          <PublisherStrategistNotesField
            side="allies"
            name="secretNotesAllies"
            legend="Allies strategist notes (optional)"
            hint="Commonwealth / Allied-only notes. Independent Reveal on the public log and here so Axis/Allies publishers aren’t shown the other block by default. Not encrypted."
            placeholder="e.g. Rail timing experiment — watch Axis truck commits…"
            initialValue={editEntry?.secretNotesAllies ?? ""}
            fieldClass={field}
            subClass={sub}
            legClass={leg}
            resetKey={editEntry?.id ?? "create"}
          />
        </>
      ) : (
        <>
          <fieldset className="rounded-xl border border-dashed border-sand-400 bg-sand-50 p-4">
            <legend className={leg}>Axis strategist notes (optional)</legend>
            <p className={`mb-2 text-xs ${sub}`}>
              Axis-only planning, hunches, or experiments. Shown on the public log only after a separate <strong>Reveal</strong>{" "}
              from Allies notes. Not encrypted.
            </p>
            <textarea
              name="secretNotesAxis"
              rows={4}
              className={field}
              placeholder="e.g. Dummy stack near the wire — rules check next time…"
              aria-label="Axis strategist notes"
              defaultValue={editEntry?.secretNotesAxis ?? ""}
            />
          </fieldset>

          <fieldset className="rounded-xl border border-dashed border-sand-400 bg-sand-50 p-4">
            <legend className={leg}>Allies strategist notes (optional)</legend>
            <p className={`mb-2 text-xs ${sub}`}>
              Commonwealth / Allied-only notes. Revealed independently of Axis. Not encrypted.
            </p>
            <textarea
              name="secretNotesAllies"
              rows={4}
              className={field}
              placeholder="e.g. Rail timing experiment — watch Axis truck commits…"
              aria-label="Allies strategist notes"
              defaultValue={editEntry?.secretNotesAllies ?? ""}
            />
          </fieldset>
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className={label}>Episode #</span>
          <input
            name="episodeNumber"
            type="number"
            min={1}
            className={`${field} font-mono`}
            value={episodeNumber}
            onChange={(e) => setEpisodeNumber(Math.max(1, parseInt(e.target.value, 10) || 1))}
          />
          <span className={`mt-1 block text-xs ${sub}`}>
            {isEdit
              ? "Change only if you renumbered the podcast; public ordering uses this field."
              : `Pre-filled as max published episode + 1 (${nextEpisodeNumber}). Edit if you renumbered the show.`}
          </span>
        </label>
        <label className="block text-sm">
          <span className={label}>Podcast URL</span>
          <input
            name="podcastUrl"
            type="url"
            placeholder="https://…"
            className={field}
            defaultValue={editEntry?.podcastUrl ?? ""}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className={label}>Episode detail</span>
        <input
          name="podcastNoteSuffix"
          type="text"
          className={field}
          value={podcastNoteSuffix}
          onChange={(e) => setPodcastNoteSuffix(e.target.value)}
          placeholder="Optional: timestamp 14:20, chapter title, …"
        />
        <span className={`mt-1 block text-xs ${sub}`}>
          Saved as:{" "}
          <strong className={isPub ? "text-wwam-ink" : "text-sand-900"}>
            Ep {episodeNumber}
            {podcastNoteSuffix.trim() ? ` — ${podcastNoteSuffix.trim()}` : ""}
          </strong>
        </span>
      </label>

      <fieldset className={fs}>
        <legend className={leg}>Completed this session (full turn flow)</legend>
        <p className={`mb-3 text-xs ${sub}`}>
          Same graphic as the public play log. <strong className={isPub ? "text-wwam-ink" : "text-sand-900"}>Dark</strong> steps are
          already covered by other sessions this turn; tap <strong className={isPub ? "text-red-800" : "text-sand-900"}>red</strong>{" "}
          for what <em>this</em> sitting finished. Opening, then each Ops Stage as air → supply → land.
        </p>
        {isPub ? (
          <SessionTurnFlowPicker
            key={editEntry?.id ?? "create"}
            gameTurn={gameTurn}
            peerProgressByTurn={peerProgressByTurn}
            initialSessionKeys={editEntry ? sessionCheckedFlowKeys(editEntry) : new Set()}
          />
        ) : (
          <ol className="list-decimal space-y-2 pl-5 marker:font-mono marker:text-xs marker:text-sand-500">
            {TURN_FLOW_MILESTONES.map((m) => (
              <li key={m.key} className="pl-1">
                <label className={`flex cursor-pointer items-start gap-2 ${cb}`}>
                  <input
                    type="checkbox"
                    name={m.key}
                    defaultChecked={editEntry?.[m.key] ?? false}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-sand-400"
                  />
                  <span>{m.label}</span>
                </label>
              </li>
            ))}
          </ol>
        )}
      </fieldset>

      {isEdit && editEntry!.images.length > 0 ? (
        <fieldset className={fs}>
          <legend className={leg}>Existing images</legend>
          <p className={`mb-3 text-xs ${sub}`}>Check <strong>Remove</strong> to delete a file from the server and the public log.</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {editEntry!.images.map((img) => (
              <li
                key={img.id}
                className="flex gap-3 rounded-lg border border-wwam-gold/20 bg-white/80 p-2"
              >
                <Image
                  src={img.url}
                  alt=""
                  width={96}
                  height={64}
                  unoptimized
                  className="h-16 w-24 shrink-0 rounded-md object-cover"
                />
                <label className={`flex min-w-0 flex-1 cursor-pointer items-start gap-2 ${cb}`}>
                  <input
                    type="checkbox"
                    name="removeImageId"
                    value={img.id}
                    className="mt-1 h-4 w-4 rounded border-wwam-gold/40 text-wwam-ink"
                  />
                  <span className="break-words text-xs leading-snug">
                    <span className="font-medium">Remove</span>
                    <span className="mt-0.5 block text-wwam-dune">{img.originalName}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ) : null}

      <label className="block text-sm">
        <span className={label}>{isEdit ? "Add images (JPEG only)" : "Images (JPEG only)"}</span>
        <input name="images" type="file" accept="image/jpeg,.jpg,.jpeg" multiple className={fileIn} />
      </label>

      <div className="flex flex-wrap gap-3">
        <SubmitButton variant={variant} isEdit={isEdit} />
        {isEdit ? (
          <Link
            href="/publish"
            className="inline-flex items-center rounded-xl border border-wwam-gold/30 px-5 py-3 text-sm font-medium text-wwam-ink transition hover:bg-wwam-gold/10"
          >
            Cancel
          </Link>
        ) : null}
      </div>
    </form>
  );
}
