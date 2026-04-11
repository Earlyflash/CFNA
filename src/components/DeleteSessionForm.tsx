"use client";

import { useFormStatus } from "react-dom";
import { deleteSessionEntry } from "@/app/actions";

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="border border-np-red/40 px-3 py-1.5 text-xs font-semibold text-np-red transition hover:bg-np-red hover:text-np-paper disabled:opacity-50"
    >
      {pending ? "Deleting\u2026" : "Delete"}
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
            `Delete "${title.slice(0, 80)}${title.length > 80 ? "\u2026" : ""}"? This removes the session and its images from disk and the public log.`,
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
