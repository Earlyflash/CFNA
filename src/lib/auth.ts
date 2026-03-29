import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const PUBLISHER_COOKIE = "wwam_publisher";

function secretKey() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error("AUTH_SECRET must be set to at least 16 characters.");
  }
  return new TextEncoder().encode(s);
}

export async function signPublisherToken(username: string) {
  return new SignJWT({ role: "publisher" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secretKey());
}

export async function verifyPublisherToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.role !== "publisher") return null;
    const sub = payload.sub;
    return typeof sub === "string" ? sub : null;
  } catch {
    return null;
  }
}

export async function getPublisherUsername(): Promise<string | null> {
  try {
    const jar = await cookies();
    const raw = jar.get(PUBLISHER_COOKIE)?.value;
    if (!raw) return null;
    return await verifyPublisherToken(raw);
  } catch {
    return null;
  }
}

const cookieBase = () => ({
  httpOnly: true as const,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
});

export async function setPublisherCookie(token: string) {
  const jar = await cookies();
  jar.set(PUBLISHER_COOKIE, token, {
    ...cookieBase(),
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearPublisherCookie() {
  const jar = await cookies();
  jar.set(PUBLISHER_COOKIE, "", {
    ...cookieBase(),
    maxAge: 0,
  });
}

export function getExpectedCredentials() {
  const username = process.env.AUTH_USERNAME ?? "";
  const password = process.env.AUTH_PASSWORD ?? "";
  return { username, password };
}
