"use server";

import { revalidatePath } from "next/cache";
import { createHash } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  clearPublisherCookie,
  getExpectedCredentials,
  setPublisherCookie,
  signPublisherToken,
} from "@/lib/auth";
import {
  clearLoginFailures,
  loginRateLimitStatus,
  recordLoginFailure,
} from "@/lib/loginRateLimit";
import { timingSafeStringEqual } from "@/lib/secureCompare";

export type LoginState = { error: string | null };

function clientIpFromHeaders(h: Headers): string | null {
  const fwd = h.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return h.get("x-real-ip")?.trim() || null;
}

function fallbackRateLimitKey(h: Headers, username: string): string {
  const ua = h.get("user-agent")?.trim() || "unknown";
  const digest = createHash("sha256")
    .update(`${username.toLowerCase()}|${ua}`)
    .digest("hex")
    .slice(0, 24);
  return `fallback:${digest}`;
}

export async function loginPublisher(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const h = await headers();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const ip = clientIpFromHeaders(h);
  const rateLimitKey = ip ? `ip:${ip}` : fallbackRateLimitKey(h, username);
  const { username: u, password: p } = getExpectedCredentials();

  if (!u || !p) {
    return { error: "Server is not configured for sign-in (missing AUTH_USERNAME / AUTH_PASSWORD)." };
  }

  if (username.length > 256 || password.length > 4096) {
    recordLoginFailure(rateLimitKey);
    return { error: "That username or password didn’t match." };
  }

  const limited = loginRateLimitStatus(rateLimitKey);
  if (!limited.ok) {
    const m = Math.ceil(limited.retryAfterSec / 60);
    return {
      error:
        m >= 1
          ? `Too many sign-in attempts. Try again in about ${m} minute${m === 1 ? "" : "s"}.`
          : "Too many sign-in attempts. Try again shortly.",
    };
  }

  const userOk = timingSafeStringEqual(username, u);
  const passOk = timingSafeStringEqual(password, p);
  if (!userOk || !passOk) {
    recordLoginFailure(rateLimitKey);
    return { error: "That username or password didn’t match." };
  }

  clearLoginFailures(rateLimitKey);

  let token: string;
  try {
    token = await signPublisherToken(username);
  } catch {
    return { error: "Server sign-in is misconfigured (check AUTH_SECRET)." };
  }
  await setPublisherCookie(token);
  revalidatePath("/");
  revalidatePath("/publish");
  revalidatePath("/publish/new");
  redirect("/publish");
}

export async function logoutPublisher() {
  await clearPublisherCookie();
  revalidatePath("/");
  revalidatePath("/publish");
  revalidatePath("/publish/new");
  redirect("/");
}
