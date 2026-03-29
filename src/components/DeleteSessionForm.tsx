"use client";

import { useFormStatus } from "react-dom";
import { deleteSessionEntry } from "@/app/actions";

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-red-900/40 bg-red-950/40 px-3 py-1.5 text-xs font-medium text-red-200 transition hover:bg-red-950/70 disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

type Props = {
  entryId: string;
  campaignId: string;
  title: string;
};

export function DeleteSessionForm({ entryId, campaignId, title }: Props) {
  return (
    <form
      action={deleteSessionEntry}
      onSubmit={(e) => {
        if (
          !confirm(
            `Delete “${title.slice(0, 80)}${title.length > 80 ? "…" : ""}”? This removes the session and its images from disk and the public log.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="entryId" value={entryId} />
      <input type="hidden" name="campaignId" value={campaignId} />
      <DeleteButton />
    </form>
  );
}
