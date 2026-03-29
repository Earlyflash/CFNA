import type { SessionEntry } from "@prisma/client";

/** Newest `playedAt` first; ties use higher `episodeNumber` first. */
export function sortSessionsByNewestFirst<
  T extends Pick<SessionEntry, "episodeNumber" | "playedAt">,
>(sessions: T[]): T[] {
  return [...sessions].sort((a, b) => {
    const ta = new Date(a.playedAt).getTime();
    const tb = new Date(b.playedAt).getTime();
    if (tb !== ta) return tb - ta;
    return b.episodeNumber - a.episodeNumber;
  });
}
