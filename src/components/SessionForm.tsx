"use client";

import { useFormStatus } from "react-dom";
import { createSessionEntry } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-sand-900 px-4 py-2.5 text-sm font-medium text-sand-50 hover:bg-sand-800 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Publish session log"}
    </button>
  );
}

type Props = {
  campaignId: string;
  defaultGameTurn: number;
};

export function SessionForm({ campaignId, defaultGameTurn }: Props) {
  return (
    <form action={createSessionEntry} className="space-y-6 rounded-2xl border border-sand-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="campaignId" value={campaignId} />

      <div>
        <h2 className="text-lg font-semibold text-sand-900">New session entry</h2>
        <p className="mt-1 text-sm text-sand-600">
          Log what <em>this session</em> finished. Multiple entries per game-turn combine into the graphic above.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-sand-800">Game-turn #</span>
          <input
            name="gameTurn"
            type="number"
            min={1}
            defaultValue={defaultGameTurn}
            className="mt-1 w-full rounded-lg border border-sand-300 px-3 py-2 font-mono text-sand-900"
            required
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-sand-800">Side</span>
          <select
            name="side"
            className="mt-1 w-full rounded-lg border border-sand-300 px-3 py-2 text-sand-900"
            required
          >
            <option value="AXIS">Axis</option>
            <option value="ALLIED">Allied (Commonwealth)</option>
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-sand-800">Session date</span>
        <input
          name="playedAt"
          type="datetime-local"
          className="mt-1 w-full rounded-lg border border-sand-300 px-3 py-2 text-sand-900"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-sand-800">Title</span>
        <input
          name="title"
          type="text"
          placeholder="e.g. Turn 4 — Allied: OS1 movement & combat"
          className="mt-1 w-full rounded-lg border border-sand-300 px-3 py-2 text-sand-900"
          required
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-sand-800">Summary</span>
        <textarea
          name="summary"
          rows={5}
          placeholder="What happened at the table, what you’ll resume next time, notable dice or rule lookups…"
          className="mt-1 w-full rounded-lg border border-sand-300 px-3 py-2 text-sand-900"
          required
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-sand-800">Podcast URL</span>
          <input
            name="podcastUrl"
            type="url"
            placeholder="https://…"
            className="mt-1 w-full rounded-lg border border-sand-300 px-3 py-2 text-sand-900"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-sand-800">Episode note</span>
          <input
            name="podcastNote"
            type="text"
            placeholder="Ep 12 — timestamp 14:20"
            className="mt-1 w-full rounded-lg border border-sand-300 px-3 py-2 text-sand-900"
          />
        </label>
      </div>

      <fieldset className="rounded-xl border border-sand-200 bg-sand-50/80 p-4">
        <legend className="px-1 text-sm font-medium text-sand-800">Completed this session (Land sequence)</legend>
        <p className="mb-3 text-xs text-sand-600">
          Check only what you <strong>finished</strong> in this recording — typical sessions cover one or two Op Stages,
          not the whole turn.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ["doneInitiative", "Initiative determination"],
            ["doneNaval", "Naval convoy stage"],
            ["doneOpStage1", "Operations stage 1"],
            ["doneOpStage2", "Operations stage 2"],
            ["doneOpStage3", "Operations stage 3"],
          ].map(([name, label]) => (
            <li key={name}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-sand-800">
                <input type="checkbox" name={name} className="h-4 w-4 rounded border-sand-400" />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <label className="block text-sm">
        <span className="font-medium text-sand-800">Images (JPEG only)</span>
        <input
          name="images"
          type="file"
          accept="image/jpeg,.jpg,.jpeg"
          multiple
          className="mt-1 block w-full text-sm text-sand-700 file:mr-3 file:rounded-lg file:border-0 file:bg-sand-200 file:px-3 file:py-2 file:text-sm file:font-medium file:text-sand-900 hover:file:bg-sand-300"
        />
      </label>

      <SubmitButton />
    </form>
  );
}
