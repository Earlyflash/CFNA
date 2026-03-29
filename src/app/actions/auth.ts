"use server";

import { revalidatePath } from "next/cache";
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

function clientIpFromHeaders(h: Headers): string {
  const fwd = h.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return h.get("x-real-ip")?.trim() || "unknown";
}

export async function loginPublisher(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const h = await headers();
  const ip = clientIpFromHeaders(h);

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const { username: u, password: p } = getExpectedCredentials();

  if (!u || !p) {
    return { error: "Server is not configured for sign-in (missing AUTH_USERNAME / AUTH_PASSWORD)." };
  }

  if (username.length > 256 || password.length > 4096) {
    recordLoginFailure(ip);
    return { error: "That username or password didn’t match." };
  }

  const limited = loginRateLimitStatus(ip);
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
    recordLoginFailure(ip);
    return { error: "That username or password didn’t match." };
  }

  clearLoginFailures(ip);

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
