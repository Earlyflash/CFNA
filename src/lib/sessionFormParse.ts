/** Suffix after `Ep N — ` for the episode detail field; empty if note is exactly `Ep N`. */
export function podcastDetailSuffix(
  podcastNote: string | null | undefined,
  episodeNumber: number,
): string {
  if (!podcastNote?.trim()) return "";
  const prefix = `Ep ${episodeNumber}`;
  if (podcastNote === prefix) return "";
  const withDash = `${prefix} — `;
  if (podcastNote.startsWith(withDash)) return podcastNote.slice(withDash.length);
  return "";
}

function parseBool(v: FormDataEntryValue | null): boolean {
  return v === "on" || v === "true" || v === "1";
}

function parsePublicHttpUrl(v: FormDataEntryValue | null): string | null {
  const raw = String(v ?? "").trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export type ParsedSessionFormFields = {
  campaignId: string;
  gameTurn: number;
  playedAt: Date;
  title: string;
  summary: string;
  podcastUrl: string | null;
  episodeNumber: number;
  podcastNote: string;
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
};

export function parseSessionFormFields(formData: FormData): ParsedSessionFormFields {
  const campaignId = String(formData.get("campaignId") ?? "");
  const gameTurn = Math.max(1, parseInt(String(formData.get("gameTurn") ?? "1"), 10) || 1);
  const playedAtRaw = String(formData.get("playedAt") ?? "");
  const playedAt = playedAtRaw ? new Date(playedAtRaw) : new Date();
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const podcastUrl = parsePublicHttpUrl(formData.get("podcastUrl"));

  const episodeParsed = parseInt(String(formData.get("episodeNumber") ?? ""), 10);
  const episodeNumber = Number.isFinite(episodeParsed) && episodeParsed >= 1 ? episodeParsed : 1;
  const noteSuffix = String(formData.get("podcastNoteSuffix") ?? "").trim();
  const podcastNote =
    noteSuffix.length > 0 ? `Ep ${episodeNumber} — ${noteSuffix}` : `Ep ${episodeNumber}`;

  const secretNotesAxisRaw = String(formData.get("secretNotesAxis") ?? "").trim();
  const secretNotesAxis = secretNotesAxisRaw.length > 0 ? secretNotesAxisRaw : null;
  const secretNotesAlliesRaw = String(formData.get("secretNotesAllies") ?? "").trim();
  const secretNotesAllies = secretNotesAlliesRaw.length > 0 ? secretNotesAlliesRaw : null;

  return {
    campaignId,
    gameTurn,
    playedAt,
    title,
    summary,
    podcastUrl,
    episodeNumber,
    podcastNote,
    secretNotesAxis,
    secretNotesAllies,
    doneInitiative: parseBool(formData.get("doneInitiative")),
    doneNaval: parseBool(formData.get("doneNaval")),
    doneOpStage1: parseBool(formData.get("doneOpStage1")),
    doneOpStage2: parseBool(formData.get("doneOpStage2")),
    doneOpStage3: parseBool(formData.get("doneOpStage3")),
    doneAirStrategic: parseBool(formData.get("doneAirStrategic")),
    doneAirConvoy: parseBool(formData.get("doneAirConvoy")),
    doneAirLandOs1: parseBool(formData.get("doneAirLandOs1")),
    doneAirLandOs2: parseBool(formData.get("doneAirLandOs2")),
    doneAirLandOs3: parseBool(formData.get("doneAirLandOs3")),
    doneLogisticsStores: parseBool(formData.get("doneLogisticsStores")),
    doneLogisticsWaterAttrition: parseBool(formData.get("doneLogisticsWaterAttrition")),
    doneLogisticsSupplyOs1: parseBool(formData.get("doneLogisticsSupplyOs1")),
    doneLogisticsSupplyOs2: parseBool(formData.get("doneLogisticsSupplyOs2")),
    doneLogisticsSupplyOs3: parseBool(formData.get("doneLogisticsSupplyOs3")),
  };
}
