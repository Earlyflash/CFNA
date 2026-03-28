import { PrismaClient, SessionSide } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.sessionImage.deleteMany();
  await prisma.sessionEntry.deleteMany();
  await prisma.campaign.deleteMany();

  const campaign = await prisma.campaign.create({
    data: {
      title: "Campaign for North Africa — podcast table",
      tagline:
        "Living play log: one game-turn ≈ one week; sessions usually cover one or two Operations Stages.",
    },
  });

  const base = new Date("2026-01-04T18:00:00.000Z");

  const entries: {
    offsetDays: number;
    gameTurn: number;
    side: SessionSide;
    title: string;
    summary: string;
    podcastUrl: string | null;
    podcastNote: string | null;
    doneInitiative: boolean;
    doneNaval: boolean;
    doneOpStage1: boolean;
    doneOpStage2: boolean;
    doneOpStage3: boolean;
  }[] = [
    {
      offsetDays: 0,
      gameTurn: 1,
      side: SessionSide.AXIS,
      title: "Turn 1 — Axis: opening logistics & first Op Stage",
      summary:
        "C-in-C Axis: initiative roll went to the Commonwealth; we still ran our naval convoy plan and pushed first-line trucks forward. Front line completed OS1 through Truck Convoy (Player A/B both phasing). Calling it after ~6 hours — OS2 next session.",
      podcastUrl: "https://example.com/podcast/cfna/ep01",
      podcastNote: "Ep 1 — setup through end of first Operations Stage",
      doneInitiative: true,
      doneNaval: true,
      doneOpStage1: true,
      doneOpStage2: false,
      doneOpStage3: false,
    },
    {
      offsetDays: 2,
      gameTurn: 1,
      side: SessionSide.ALLIED,
      title: "Turn 1 — Allied: OS2–OS3 wrap",
      summary:
        "Allied rear-area: rail move to staging hex, then closed the week with OS2 and OS3 (movement/combat cycles + patrol wrap). Turn 1 is officially complete on the calendar.",
      podcastUrl: "https://example.com/podcast/cfna/ep02",
      podcastNote: "Ep 2 — second and third Op Stages",
      doneInitiative: false,
      doneNaval: false,
      doneOpStage1: false,
      doneOpStage2: true,
      doneOpStage3: true,
    },
    {
      offsetDays: 9,
      gameTurn: 2,
      side: SessionSide.AXIS,
      title: "Turn 2 — Axis: initiative & convoy only",
      summary:
        "Short mid-week session: re-rolled initiative (Axis), plotted next convoy cargoes and tactical shipping. Paused before Organization Phase of OS1.",
      podcastUrl: "https://example.com/podcast/cfna/ep03",
      podcastNote: "Ep 3 — abbreviated; logistics focus",
      doneInitiative: true,
      doneNaval: true,
      doneOpStage1: false,
      doneOpStage2: false,
      doneOpStage3: false,
    },
    {
      offsetDays: 11,
      gameTurn: 2,
      side: SessionSide.ALLIED,
      title: "Turn 2 — Allied: OS1 only",
      summary:
        "Weather clear. Ran full OS1 (organization through patrol) from Allied phasing perspective; Axis mirror still to do for OS1 next time.",
      podcastUrl: null,
      podcastNote: null,
      doneInitiative: false,
      doneNaval: false,
      doneOpStage1: true,
      doneOpStage2: false,
      doneOpStage3: false,
    },
    {
      offsetDays: 18,
      gameTurn: 3,
      side: SessionSide.AXIS,
      title: "Turn 3 — Axis: initiative declaration",
      summary:
        "Single-hour session: initiative determination and declaration only. Recording a clip for listeners on how the phasing player choice works.",
      podcastUrl: "https://example.com/podcast/cfna/ep04",
      podcastNote: "Ep 4 — initiative mini-segment",
      doneInitiative: true,
      doneNaval: false,
      doneOpStage1: false,
      doneOpStage2: false,
      doneOpStage3: false,
    },
    {
      offsetDays: 20,
      gameTurn: 3,
      side: SessionSide.ALLIED,
      title: "Turn 3 — Allied: naval & start of OS1",
      summary:
        "Fleet assignments, convoy arrivals checked, then first half of OS1 through Reserve Designation. Movement/combat cycles deferred to the next recording.",
      podcastUrl: null,
      podcastNote: null,
      doneInitiative: false,
      doneNaval: true,
      doneOpStage1: true,
      doneOpStage2: false,
      doneOpStage3: false,
    },
  ];

  for (const e of entries) {
    const playedAt = new Date(base);
    playedAt.setUTCDate(playedAt.getUTCDate() + e.offsetDays);
    await prisma.sessionEntry.create({
      data: {
        campaignId: campaign.id,
        gameTurn: e.gameTurn,
        side: e.side,
        playedAt,
        title: e.title,
        summary: e.summary,
        podcastUrl: e.podcastUrl,
        podcastNote: e.podcastNote,
        doneInitiative: e.doneInitiative,
        doneNaval: e.doneNaval,
        doneOpStage1: e.doneOpStage1,
        doneOpStage2: e.doneOpStage2,
        doneOpStage3: e.doneOpStage3,
      },
    });
  }

  console.log("Seeded campaign", campaign.id);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
