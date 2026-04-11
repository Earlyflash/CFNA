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

function formatDatetimeLocal(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function SubmitButton({ variant, isEdit }: { variant: "default" | "publish"; isEdit: boolean }) {
  const { pending } = useFormStatus();
  const cls =
    variant === "publish"
      ? "border-2 border-np-ink bg-np-ink px-5 py-3 text-sm font-bold uppercase tracking-wider text-np-paper transition hover:bg-np-ink-light disabled:opacity-60"
      : "border border-np-rule bg-np-paper-dark px-4 py-2.5 text-sm font-semibold text-np-ink hover:bg-np-aged/40 disabled:opacity-60";
  const label = pending ? "Saving\u2026" : isEdit ? "Save changes" : "Publish session log";
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
  nextEpisodeNumber?: number;
  variant?: "default" | "publish";
  editEntry?: SessionEditInitial | null;
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
    : "space-y-6 border border-np-rule bg-np-paper p-6";

  const label = "font-semibold text-np-ink";
  const field = isPub
    ? "mt-1 w-full border-b-2 border-np-rule bg-transparent px-1 py-2 text-np-ink placeholder:text-np-ink-muted/50 focus:border-np-ink focus:outline-none"
    : "mt-1 w-full border border-np-rule px-3 py-2 text-np-ink bg-np-paper focus:border-np-ink focus:outline-none";
  const sub = "text-sm text-np-ink-muted";
  const titleC = "font-display text-lg font-bold text-np-ink";
  const fs = isPub
    ? "border border-np-rule bg-np-paper-dark p-4"
    : "border border-dashed border-np-rule bg-np-paper-dark p-4";
  const leg = "px-1 text-sm font-semibold text-np-ink";
  const cb = "text-sm text-np-ink";
  const fileIn = isPub
    ? "mt-1 block w-full text-sm text-np-ink-muted file:mr-3 file:border file:border-np-ink file:bg-np-paper file:px-3 file:py-2 file:text-sm file:font-semibold file:text-np-ink hover:file:bg-np-aged/30"
    : "mt-1 block w-full text-sm text-np-ink-muted file:mr-3 file:border file:border-np-rule file:bg-np-paper file:px-3 file:py-2 file:text-sm file:font-medium file:text-np-ink hover:file:bg-np-aged/30";

  const formAction = isEdit ? updateSessionEntry : createSessionEntry;

  return (
    <form action={formAction} className={formShell}>
      <input type="hidden" name="campaignId" value={campaignId} />
      {isEdit ? <input type="hidden" name="entryId" value={editEntry!.id} /> : null}

      <div>
        <h2 className={titleC}>{isEdit ? "Edit Session Entry" : "New Session Entry"}</h2>
        <p className={`mt-1 ${sub}`}>
          {isEdit
            ? "Update this log entry; changes appear on the public site after you save."
            : "One entry per recording: cover both sides\u2019 moves and stages for that sitting. Milestones you check off merge into the public turn graphic for that game-turn."}
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
          placeholder="e.g. Turn 4 \u2014 Ep 12: Ops Stage 1 movement & combat (both sides)"
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
          placeholder="What happened at the table, what you\u2019ll resume next time, notable dice or rule lookups\u2026"
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
            placeholder="e.g. Dummy stack near the wire \u2014 rules check next time\u2026"
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
            hint="Commonwealth / Allied-only notes. Independent Reveal on the public log and here so Axis/Allies publishers aren\u2019t shown the other block by default. Not encrypted."
            placeholder="e.g. Rail timing experiment \u2014 watch Axis truck commits\u2026"
            initialValue={editEntry?.secretNotesAllies ?? ""}
            fieldClass={field}
            subClass={sub}
            legClass={leg}
            resetKey={editEntry?.id ?? "create"}
          />
        </>
      ) : (
        <>
          <fieldset className="border border-dashed border-np-rule bg-np-paper-dark p-4">
            <legend className={leg}>Axis strategist notes (optional)</legend>
            <p className={`mb-2 text-xs ${sub}`}>
              Axis-only planning, hunches, or experiments. Shown on the public log only after a separate <strong>Reveal</strong>{" "}
              from Allies notes. Not encrypted.
            </p>
            <textarea
              name="secretNotesAxis"
              rows={4}
              className={field}
              placeholder="e.g. Dummy stack near the wire \u2014 rules check next time\u2026"
              aria-label="Axis strategist notes"
              defaultValue={editEntry?.secretNotesAxis ?? ""}
            />
          </fieldset>

          <fieldset className="border border-dashed border-np-rule bg-np-paper-dark p-4">
            <legend className={leg}>Allies strategist notes (optional)</legend>
            <p className={`mb-2 text-xs ${sub}`}>
              Commonwealth / Allied-only notes. Revealed independently of Axis. Not encrypted.
            </p>
            <textarea
              name="secretNotesAllies"
              rows={4}
              className={field}
              placeholder="e.g. Rail timing experiment \u2014 watch Axis truck commits\u2026"
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
            placeholder="https://\u2026"
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
          placeholder="Optional: timestamp 14:20, chapter title, \u2026"
        />
        <span className={`mt-1 block text-xs ${sub}`}>
          Saved as:{" "}
          <strong className="text-np-ink">
            Ep {episodeNumber}
            {podcastNoteSuffix.trim() ? ` \u2014 ${podcastNoteSuffix.trim()}` : ""}
          </strong>
        </span>
      </label>

      <fieldset className={fs}>
        <legend className={leg}>Completed this session (full turn flow)</legend>
        <p className={`mb-3 text-xs ${sub}`}>
          Same graphic as the public play log. <strong className="text-np-ink">Dark</strong> steps are
          already covered by other sessions this turn; tap <strong className="text-np-red">red</strong>{" "}
          for what <em>this</em> sitting finished. Opening, then each Ops Stage as air &rarr; supply &rarr; land.
        </p>
        {isPub ? (
          <SessionTurnFlowPicker
            key={editEntry?.id ?? "create"}
            gameTurn={gameTurn}
            peerProgressByTurn={peerProgressByTurn}
            initialSessionKeys={editEntry ? sessionCheckedFlowKeys(editEntry) : new Set()}
          />
        ) : (
          <ol className="list-decimal space-y-2 pl-5 marker:font-mono marker:text-xs marker:text-np-ink-muted">
            {TURN_FLOW_MILESTONES.map((m) => (
              <li key={m.key} className="pl-1">
                <label className={`flex cursor-pointer items-start gap-2 ${cb}`}>
                  <input
                    type="checkbox"
                    name={m.key}
                    defaultChecked={editEntry?.[m.key] ?? false}
                    className="mt-0.5 h-4 w-4 shrink-0 border-np-rule"
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
                className="flex gap-3 border border-np-rule bg-np-paper p-2"
              >
                <Image
                  src={img.url}
                  alt=""
                  width={96}
                  height={64}
                  unoptimized
                  className="h-16 w-24 shrink-0 object-cover"
                />
                <label className={`flex min-w-0 flex-1 cursor-pointer items-start gap-2 ${cb}`}>
                  <input
                    type="checkbox"
                    name="removeImageId"
                    value={img.id}
                    className="mt-1 h-4 w-4 border-np-rule text-np-ink"
                  />
                  <span className="break-words text-xs leading-snug">
                    <span className="font-semibold">Remove</span>
                    <span className="mt-0.5 block text-np-ink-muted">{img.originalName}</span>
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
            className="inline-flex items-center border border-np-rule px-5 py-3 text-sm font-semibold text-np-ink transition hover:bg-np-aged/30"
          >
            Cancel
          </Link>
        ) : null}
      </div>
    </form>
  );
}
