import { createHash, timingSafeEqual } from "crypto";

/** Constant-time comparison of two strings via SHA-256 digests (same-length compare). */
export function timingSafeStringEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a, "utf8").digest();
  const hb = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(ha, hb);
}
