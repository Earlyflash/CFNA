"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { SessionSide } from "@prisma/client";

const JPEG_MIME = new Set(["image/jpeg", "image/jpg"]);

function parseSide(v: FormDataEntryValue | null): SessionSide {
  const s = String(v ?? "").toUpperCase();
  if (s === "ALLIED") return SessionSide.ALLIED;
  return SessionSide.AXIS;
}

function parseBool(v: FormDataEntryValue | null): boolean {
  return v === "on" || v === "true" || v === "1";
}

export async function createSessionEntry(formData: FormData) {
  const campaignId = String(formData.get("campaignId") ?? "");
  const gameTurn = Math.max(1, parseInt(String(formData.get("gameTurn") ?? "1"), 10) || 1);
  const side = parseSide(formData.get("side"));
  const playedAtRaw = String(formData.get("playedAt") ?? "");
  const playedAt = playedAtRaw ? new Date(playedAtRaw) : new Date();
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const podcastUrl = String(formData.get("podcastUrl") ?? "").trim() || null;
  const podcastNote = String(formData.get("podcastNote") ?? "").trim() || null;

  if (!campaignId) throw new Error("Missing campaign");
  if (!title) throw new Error("Title required");
  if (!summary) throw new Error("Summary required");

  const entry = await prisma.sessionEntry.create({
    data: {
      campaignId,
      gameTurn,
      side,
      playedAt,
      title,
      summary,
      podcastUrl,
      podcastNote,
      doneInitiative: parseBool(formData.get("doneInitiative")),
      doneNaval: parseBool(formData.get("doneNaval")),
      doneOpStage1: parseBool(formData.get("doneOpStage1")),
      doneOpStage2: parseBool(formData.get("doneOpStage2")),
      doneOpStage3: parseBool(formData.get("doneOpStage3")),
    },
  });

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const files = formData.getAll("images") as unknown as File[];
  for (const file of files) {
    if (!file || typeof file === "string" || !file.size) continue;
    const mime = file.type.toLowerCase();
    if (!JPEG_MIME.has(mime)) continue;
    const buf = Buffer.from(await file.arrayBuffer());
    const name = `${randomUUID()}.jpg`;
    const diskPath = path.join(uploadDir, name);
    await writeFile(diskPath, buf);
    await prisma.sessionImage.create({
      data: {
        sessionEntryId: entry.id,
        url: `/uploads/${name}`,
        originalName: file.name || name,
      },
    });
  }

  revalidatePath("/");
}
