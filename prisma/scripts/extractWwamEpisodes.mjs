import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const xmlPath = path.join(__dirname, "..", "_wwam_feed.xml");
const outPath = path.join(__dirname, "..", "wwamEpisodes.seed.ts");

const xml = fs.readFileSync(xmlPath, "utf8");
const items = xml.split("<item>").slice(1);
const out = [];
for (const block of items) {
  const lm = block.match(/<link>(https:\/\/rss\.com\/podcasts\/war-with-a-mate\/\d+)<\/link>/);
  const link = lm?.[1];
  const tm = block.match(/<title><!\[CDATA\[([^\]]*)\]\]><\/title>/);
  const title = tm?.[1]?.trim() ?? "";
  const pm = block.match(/<pubDate>([^<]+)<\/pubDate>/);
  const pubDate = pm?.[1] ?? "";
  const em = block.match(/<itunes:episode>([^<]+)<\/itunes:episode>/);
  const itunesEpisode = em?.[1]?.trim() ?? null;
  if (!link || !title) continue;
  out.push({ link, title, pubDate, itunesEpisode });
}
out.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));

const lines = out.map(
  (e, i) =>
    `  { episodeIndex: ${i + 1}, url: ${JSON.stringify(e.link)}, title: ${JSON.stringify(e.title)}, itunesEpisode: ${e.itunesEpisode ? JSON.stringify(e.itunesEpisode) : "null"} },`,
);

const header = `/**
 * War With A Mate — episode links from the public RSS feed (rss.com).
 * Regenerate: download https://media.rss.com/war-with-a-mate/feed.xml to prisma/_wwam_feed.xml,
 * then \`node prisma/scripts/extractWwamEpisodes.mjs\`.
 */
export type WwamRssEpisode = {
  episodeIndex: number;
  url: string;
  title: string;
  itunesEpisode: string | null;
};

export const WWAM_RSS_EPISODES: readonly WwamRssEpisode[] = [
`;

fs.writeFileSync(outPath, `${header}${lines.join("\n")}\n] as const;\n`);
console.log("Wrote", outPath, "episodes:", out.length);
