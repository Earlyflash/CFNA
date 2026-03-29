import { PrismaClient } from "@prisma/client";
import { WWAM_RSS_EPISODES } from "./wwamEpisodes.seed";

const prisma = new PrismaClient();

/** Sessions per game-turn (2–5). Must sum to WWAM_RSS_EPISODES.length. */
const SESSIONS_PER_TURN = [
  5, 2, 4, 3, 5, 4, 2, 5, 3, 4, 2, 5, 3, 4, 3, 2, 5, 4, 3, 3,
] as const;

const NUM_TURNS = SESSIONS_PER_TURN.length;
const PODCAST_COUNT = WWAM_RSS_EPISODES.length;
const SESSION_TOTAL = SESSIONS_PER_TURN.reduce((a, b) => a + b, 0);

if (SESSION_TOTAL !== PODCAST_COUNT) {
  throw new Error(
    `Seed mismatch: SESSIONS_PER_TURN sums to ${SESSION_TOTAL} but WWAM_RSS_EPISODES has ${PODCAST_COUNT} episodes`,
  );
}
for (const n of SESSIONS_PER_TURN) {
  if (n < 2 || n > 5) throw new Error(`Invalid sessions per turn: ${n}`);
}

/** All 15 turn-flow flags false */
const Z = {
  doneInitiative: false,
  doneNaval: false,
  doneOpStage1: false,
  doneOpStage2: false,
  doneOpStage3: false,
  doneAirStrategic: false,
  doneAirConvoy: false,
  doneAirLandOs1: false,
  doneAirLandOs2: false,
  doneAirLandOs3: false,
  doneLogisticsStores: false,
  doneLogisticsWaterAttrition: false,
  doneLogisticsSupplyOs1: false,
  doneLogisticsSupplyOs2: false,
  doneLogisticsSupplyOs3: false,
};

const openingOnly = {
  ...Z,
  doneInitiative: true,
  doneNaval: true,
  doneAirStrategic: true,
  doneAirConvoy: true,
  doneLogisticsStores: true,
  doneLogisticsWaterAttrition: true,
};

const opsStagesOnly = {
  ...Z,
  doneAirLandOs1: true,
  doneLogisticsSupplyOs1: true,
  doneOpStage1: true,
  doneAirLandOs2: true,
  doneLogisticsSupplyOs2: true,
  doneOpStage2: true,
  doneAirLandOs3: true,
  doneLogisticsSupplyOs3: true,
  doneOpStage3: true,
};

const axisSecretPool = [
  "Rommel-stack timing is the whole game this month: we’re talking east on the podcast and in front of the Allied player, but the real punch stays on the coastal road until we see how they commit reserves. Don’t telegraph that on-mic until the episode is in the can — if they smell the feint they’ll stack the escarpment and we lose the tempo we’ve been buying with nuisance raids. James has the marker bag; Andy, you own the narrative. If anyone asks, we’re ‘probing.’",
  "Fuel math is tighter than it sounds on the recap. We can afford exactly one extra pursuit round if Tobruk’s garrison stays passive and we don’t burn trucks on a silly second supply trace — but that ‘if’ is doing a lot of work. Before next session, both of us need to re-count the truck pool against the actual counters on the map, not the spreadsheet from three weeks ago. If we’re short even one step, we pull the pursuit and eat the story beat.",
  "If they overcommit mines and wire to the escarpment lip, we pivot the whole truck line south and accept worse roads for one Ops Stage. That’s already pencilled on the umpire copy of the chart — look for the small south-arrow sticker — but we don’t flip that plan until we’ve seen their recon habits over two sittings. Italian liaison will whinge; we nod, then do what wins the week.",
  "Italian liaison keeps asking for prettier CAP diagrams on paper. Fine: we give them boxes that look decisive and keep our real coverage flexible in the air rules layer. The podcast can mention ‘coordination’ without spelling hexes. If the Allies ever FOIA our session photos, the joke’s on them — the pretty map is theatre, the messy one is the game.",
  "The dummy HQ near the wire might be too cute once the umpire reads the supply example in the errata thread. Let’s not defend it to the death in rules-lawyer mode; we’ll vote after we see whether Allied recon always checks that hex. If it becomes a time sink, we retire the bit and say we ‘redeployed’ — listeners love a retreat story if we sell it as cunning.",
  "Benghazi offload priority for the narrative is armour first, then POL — but what we’re actually doing on the table is the opposite until the convoy phase closes, because we need the trucks alive for the push two weeks from now. Never say that aloud at the table with the mic hot. On-air we stress ‘flexibility’ and ‘Axis logistics genius.’ Off-air we’re spreadsheet goblins.",
];

const alliesSecretPool = [
  "We’re trading space for time until American kit can plausibly show up in the campaign story without breaking immersion — which means the podcast tone stays stoic even when the map looks awful. Don’t sound desperate on the recap; sound like people who expected a long war. If listeners hear panic, Axis morale at the table goes up and we negotiate worse deals on optional rules.",
  "If Axis burns command points early on air, we deliberately spike the ‘rail spike’ resolution one Ops Stage late and pray the die forgive us. That’s ugly and we both hate it, but it’s the only lever we have without rewriting history. We need a shared hand signal before someone blurts the plan into the recording chain. James: you’re the brake on Andy’s ‘heroic last stand’ impulses.",
  "Navy is quietly fine with losing one convoy die this turn if it frees CAP for the central box where we’re actually bleeding. That agreement is off-books with the umpire — don’t explain it on the podcast as a ‘trade’ or the audience will think we’re throwing the game. We sell it as ‘weather’ and ‘escort dispersion’ and move on before anyone asks follow-ups.",
  "The Churchill memo bit in the mailbag segment is for listeners who like politics; the actual plan at the table is still don’t get encircled and don’t run out of water counters. If those two goals conflict, water wins — dead armies don’t hold memorable last stands. We can be witty about London after we’ve secured the canteen track.",
  "We’re considering a notional ‘fortress line’ label for a stack that isn’t really a fortress in the rules sense. It might be against club ethos if we lean on it for DRMs we haven’t earned. Discuss in Axis earshot only if we’re willing to defend it in the same breath; otherwise keep it in allied-side notes until the umpire signs off.",
  "Water counters are one bad die from becoming the entire episode. Stockpile narrative excuses now — heat, bad wells, trucks ‘delayed’ — so when the crunch hits we’re not improvising purple prose on the spot. The audience should feel tension without us admitting we’re three sips from a total collapse. If we go down, we go down with a paragraph ready.",
];

function strategistNotesForEpisode(episodeNumber: number): {
  secretNotesAxis: string | null;
  secretNotesAllies: string | null;
} {
  if (episodeNumber % 2 === 1) {
    return { secretNotesAxis: null, secretNotesAllies: null };
  }
  const ai = episodeNumber % axisSecretPool.length;
  const bi = (episodeNumber * 3) % alliesSecretPool.length;
  const mode = episodeNumber % 3;
  if (mode === 0) {
    return {
      secretNotesAxis: axisSecretPool[ai] ?? null,
      secretNotesAllies: alliesSecretPool[bi] ?? null,
    };
  }
  if (mode === 1) {
    return { secretNotesAxis: axisSecretPool[ai] ?? null, secretNotesAllies: null };
  }
  return { secretNotesAxis: null, secretNotesAllies: alliesSecretPool[bi] ?? null };
}

type EntryRow = {
  offsetDays: number;
  gameTurn: number;
  title: string;
  summary: string;
  podcastUrl: string | null;
  podcastNote: string | null;
  episodeNumber: number;
  secretNotesAxis: string | null;
  secretNotesAllies: string | null;
} & typeof Z;

function row(
  base: Omit<EntryRow, keyof typeof Z> & Partial<typeof Z>,
  flags: typeof Z,
): EntryRow {
  return { ...Z, ...flags, ...base };
}

const axisTones = [
  "Axis spearheads gain ground; Allied lines bend but rarely break cleanly.",
  "Rommel’s tempo keeps Commonwealth off balance; supply chatter dominates Allied side of the table.",
  "Encirclement scares and breakout dice — Axis players smiling more than the desert sun suggests.",
  "Tobruk and the wire still matter, but the narrative is Axis choosing when fights happen.",
  "Allied air and navy still sting, but land exchanges trend Axis on points and positioning.",
];

function sessionSummary(params: {
  turn: number;
  sessionIndex: number;
  sessionCount: number;
  wwamTitle: string;
  flagsLabel: string;
}): string {
  const tone = axisTones[Math.min(params.turn - 1, axisTones.length - 1)]!;
  return [
    `${tone}`,
    `Turn ${params.turn}, session ${params.sessionIndex + 1}/${params.sessionCount} on the table (${params.flagsLabel}).`,
    `Companion audio: War With A Mate — “${params.wwamTitle}” (link is the real rss.com episode page).`,
  ].join(" ");
}

async function main() {
  await prisma.sessionImage.deleteMany();
  await prisma.sessionEntry.deleteMany();
  await prisma.campaign.deleteMany();

  const campaign = await prisma.campaign.create({
    data: {
      title: "Campaign for North Africa — podcast table",
      tagline: `Demo seed: ${NUM_TURNS} game-turns, ${PODCAST_COUNT} session rows — one per War With A Mate RSS episode (2–5 sessions per turn). Turn ${NUM_TURNS} left open; Axis-leaning copy. Podcast URLs point at rss.com episode pages.`,
    },
  });

  const base = new Date("2025-01-10T12:00:00.000Z");
  const entries: EntryRow[] = [];
  let rssCursor = 0;
  let dayCursor = 0;

  for (let turn = 1; turn <= NUM_TURNS; turn++) {
    const sessionCount = SESSIONS_PER_TURN[turn - 1]!;
    const isLastTurn = turn === NUM_TURNS;
    const turnComplete = !isLastTurn;

    for (let s = 0; s < sessionCount; s++) {
      const wwam = WWAM_RSS_EPISODES[rssCursor];
      if (!wwam) throw new Error(`Missing RSS episode at index ${rssCursor}`);
      rssCursor++;

      const notes = strategistNotesForEpisode(wwam.episodeIndex);
      const isFirst = s === 0;
      const isLastSession = s === sessionCount - 1;

      let flags: typeof Z;
      let flagsLabel: string;

      if (turnComplete) {
        if (isFirst) {
          flags = openingOnly;
          flagsLabel = "opening through water & attrition";
        } else if (isLastSession) {
          flags = opsStagesOnly;
          flagsLabel = "Ops Stages 1–3 (air → supply → land)";
        } else {
          flags = Z;
          flagsLabel = "mid-turn narrative / bookkeeping (milestones on other sittings)";
        }
      } else {
        if (isFirst) {
          flags = openingOnly;
          flagsLabel = "opening through water & attrition";
        } else if (s === 1) {
          flags = {
            ...Z,
            doneAirLandOs1: true,
            doneLogisticsSupplyOs1: true,
            doneOpStage1: true,
          };
          flagsLabel = "Ops Stage 1 complete";
        } else {
          flags = {
            ...Z,
            doneAirLandOs2: true,
            doneLogisticsSupplyOs2: true,
          };
          flagsLabel = "Ops Stage 2 air & supply only — turn still open";
        }
      }

      const title = `Turn ${turn} · ${s + 1}/${sessionCount} — ${wwam.title}`;

      entries.push(
        row(
          {
            offsetDays: dayCursor,
            gameTurn: turn,
            title,
            summary: sessionSummary({
              turn,
              sessionIndex: s,
              sessionCount,
              wwamTitle: wwam.title,
              flagsLabel,
            }),
            podcastUrl: wwam.url,
            podcastNote: wwam.itunesEpisode
              ? `WWAM ${wwam.title}`
              : `WWAM ${wwam.title} (bonus episode)`,
            episodeNumber: wwam.episodeIndex,
            secretNotesAxis: notes.secretNotesAxis,
            secretNotesAllies: notes.secretNotesAllies,
          },
          flags,
        ),
      );

      dayCursor += 3 + (s % 5);
    }
  }

  if (rssCursor !== PODCAST_COUNT) {
    throw new Error(`RSS cursor ${rssCursor} !== ${PODCAST_COUNT}`);
  }

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]!;
    const playedAt = new Date(base);
    playedAt.setUTCDate(playedAt.getUTCDate() + e.offsetDays);
    await prisma.sessionEntry.create({
      data: {
        campaignId: campaign.id,
        publishedBy: i % 2 === 0 ? "andy" : "james",
        gameTurn: e.gameTurn,
        playedAt,
        title: e.title,
        summary: e.summary,
        podcastUrl: e.podcastUrl,
        podcastNote: e.podcastNote,
        episodeNumber: e.episodeNumber,
        secretNotesAxis: e.secretNotesAxis,
        secretNotesAllies: e.secretNotesAllies,
        doneInitiative: e.doneInitiative,
        doneNaval: e.doneNaval,
        doneOpStage1: e.doneOpStage1,
        doneOpStage2: e.doneOpStage2,
        doneOpStage3: e.doneOpStage3,
        doneAirStrategic: e.doneAirStrategic,
        doneAirConvoy: e.doneAirConvoy,
        doneAirLandOs1: e.doneAirLandOs1,
        doneAirLandOs2: e.doneAirLandOs2,
        doneAirLandOs3: e.doneAirLandOs3,
        doneLogisticsStores: e.doneLogisticsStores,
        doneLogisticsWaterAttrition: e.doneLogisticsWaterAttrition,
        doneLogisticsSupplyOs1: e.doneLogisticsSupplyOs1,
        doneLogisticsSupplyOs2: e.doneLogisticsSupplyOs2,
        doneLogisticsSupplyOs3: e.doneLogisticsSupplyOs3,
      },
    });
  }

  console.log(
    "Seeded campaign",
    campaign.id,
    `(${entries.length} sessions = ${PODCAST_COUNT} WWAM episodes; ${NUM_TURNS} turns; turn ${NUM_TURNS} incomplete)`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
