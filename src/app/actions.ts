"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getPublisherUsername } from "@/lib/auth";
import { parseSessionFormFields } from "@/lib/sessionFormParse";

const JPEG_MIME = new Set(["image/jpeg", "image/jpg"]);
/** Per-file cap (server action body limit is 8 MiB in next.config). */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function bufferLooksLikeJpeg(buf: Buffer): boolean {
  return buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
}

async function requirePrimaryCampaignId(): Promise<string> {
  const c = await prisma.campaign.findFirst({ orderBy: { createdAt: "asc" } });
  if (!c) throw new Error("No campaign in database.");
  return c.id;
}

async function saveUploadedImages(entryId: string, formData: FormData) {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const files = formData.getAll("images") as unknown as File[];
  for (const file of files) {
    if (!file || typeof file === "string" || !file.size) continue;
    if (file.size > MAX_IMAGE_BYTES) continue;
    const mime = file.type.toLowerCase();
    if (!JPEG_MIME.has(mime)) continue;
    const buf = Buffer.from(await file.arrayBuffer());
    if (!bufferLooksLikeJpeg(buf)) continue;
    const name = `${randomUUID()}.jpg`;
    const diskPath = path.join(uploadDir, name);
    await writeFile(diskPath, buf);
    await prisma.sessionImage.create({
      data: {
        sessionEntryId: entryId,
        url: `/uploads/${name}`,
        originalName: file.name || name,
      },
    });
  }
}

function publicUrlToDiskPath(url: string): string | null {
  if (!url.startsWith("/uploads/")) return null;
  return path.join(process.cwd(), "public", url.replace(/^\//, ""));
}

async function unlinkUploadMaybe(url: string) {
  const disk = publicUrlToDiskPath(url);
  if (!disk) return;
  try {
    await unlink(disk);
  } catch {
    // missing file is fine
  }
}

export async function createSessionEntry(formData: FormData) {
  if (!(await getPublisherUsername())) {
    throw new Error("Sign in required to publish.");
  }

  const p = parseSessionFormFields(formData);

  const campaignId = await requirePrimaryCampaignId();
  if (!p.title) throw new Error("Title required");
  if (!p.summary) throw new Error("Summary required");

  const entry = await prisma.sessionEntry.create({
    data: {
      campaignId,
      gameTurn: p.gameTurn,
      playedAt: p.playedAt,
      title: p.title,
      summary: p.summary,
      podcastUrl: p.podcastUrl,
      podcastNote: p.podcastNote,
      episodeNumber: p.episodeNumber,
      secretNotesAxis: p.secretNotesAxis,
      secretNotesAllies: p.secretNotesAllies,
      doneInitiative: p.doneInitiative,
      doneNaval: p.doneNaval,
      doneOpStage1: p.doneOpStage1,
      doneOpStage2: p.doneOpStage2,
      doneOpStage3: p.doneOpStage3,
      doneAirStrategic: p.doneAirStrategic,
      doneAirConvoy: p.doneAirConvoy,
      doneAirLandOs1: p.doneAirLandOs1,
      doneAirLandOs2: p.doneAirLandOs2,
      doneAirLandOs3: p.doneAirLandOs3,
      doneLogisticsStores: p.doneLogisticsStores,
      doneLogisticsWaterAttrition: p.doneLogisticsWaterAttrition,
      doneLogisticsSupplyOs1: p.doneLogisticsSupplyOs1,
      doneLogisticsSupplyOs2: p.doneLogisticsSupplyOs2,
      doneLogisticsSupplyOs3: p.doneLogisticsSupplyOs3,
    },
  });

  await saveUploadedImages(entry.id, formData);

  revalidatePath("/");
  revalidatePath("/publish");
  revalidatePath("/publish/new");
}

export async function updateSessionEntry(formData: FormData) {
  if (!(await getPublisherUsername())) {
    throw new Error("Sign in required to publish.");
  }

  const entryId = String(formData.get("entryId") ?? "").trim();
  if (!entryId) throw new Error("Missing entry");

  const p = parseSessionFormFields(formData);

  const primaryCampaignId = await requirePrimaryCampaignId();
  if (p.campaignId !== primaryCampaignId) throw new Error("Session not found");
  if (!p.title) throw new Error("Title required");
  if (!p.summary) throw new Error("Summary required");

  const existing = await prisma.sessionEntry.findUnique({
    where: { id: entryId },
    include: { images: true },
  });
  if (!existing || existing.campaignId !== primaryCampaignId) {
    throw new Error("Session not found");
  }

  await prisma.sessionEntry.update({
    where: { id: entryId },
    data: {
      gameTurn: p.gameTurn,
      playedAt: p.playedAt,
      title: p.title,
      summary: p.summary,
      podcastUrl: p.podcastUrl,
      podcastNote: p.podcastNote,
      episodeNumber: p.episodeNumber,
      secretNotesAxis: p.secretNotesAxis,
      secretNotesAllies: p.secretNotesAllies,
      doneInitiative: p.doneInitiative,
      doneNaval: p.doneNaval,
      doneOpStage1: p.doneOpStage1,
      doneOpStage2: p.doneOpStage2,
      doneOpStage3: p.doneOpStage3,
      doneAirStrategic: p.doneAirStrategic,
      doneAirConvoy: p.doneAirConvoy,
      doneAirLandOs1: p.doneAirLandOs1,
      doneAirLandOs2: p.doneAirLandOs2,
      doneAirLandOs3: p.doneAirLandOs3,
      doneLogisticsStores: p.doneLogisticsStores,
      doneLogisticsWaterAttrition: p.doneLogisticsWaterAttrition,
      doneLogisticsSupplyOs1: p.doneLogisticsSupplyOs1,
      doneLogisticsSupplyOs2: p.doneLogisticsSupplyOs2,
      doneLogisticsSupplyOs3: p.doneLogisticsSupplyOs3,
    },
  });

  const removeIds = formData
    .getAll("removeImageId")
    .map((v) => String(v).trim())
    .filter(Boolean);

  for (const imgId of removeIds) {
    const img = await prisma.sessionImage.findFirst({
      where: { id: imgId, sessionEntryId: entryId },
    });
    if (!img) continue;
    await unlinkUploadMaybe(img.url);
    await prisma.sessionImage.delete({ where: { id: img.id } });
  }

  await saveUploadedImages(entryId, formData);

  revalidatePath("/");
  revalidatePath("/publish");
  revalidatePath("/publish/new");
  revalidatePath(`/publish/edit/${entryId}`);
}

export async function deleteSessionEntry(formData: FormData) {
  if (!(await getPublisherUsername())) {
    throw new Error("Sign in required to publish.");
  }

  const entryId = String(formData.get("entryId") ?? "").trim();
  const campaignId = String(formData.get("campaignId") ?? "").trim();
  if (!entryId || !campaignId) throw new Error("Missing entry or campaign");

  const primaryCampaignId = await requirePrimaryCampaignId();
  if (campaignId !== primaryCampaignId) throw new Error("Session not found");

  const existing = await prisma.sessionEntry.findUnique({
    where: { id: entryId },
    include: { images: true },
  });
  if (!existing || existing.campaignId !== primaryCampaignId) {
    throw new Error("Session not found");
  }

  for (const img of existing.images) {
    await unlinkUploadMaybe(img.url);
  }

  await prisma.sessionEntry.delete({ where: { id: entryId } });

  revalidatePath("/");
  revalidatePath("/publish");
  revalidatePath("/publish/new");
}
