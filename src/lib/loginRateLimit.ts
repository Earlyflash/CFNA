/** In-memory limiter: best-effort per Node process (e.g. `next start`). Not shared across serverless instances. */

type Entry = {
  fails: number;
  windowStart: number;
  lockedUntil?: number;
};

const store = new Map<string, Entry>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 8;
const LOCKOUT_MS = 15 * 60 * 1000;

function getEntry(ip: string): Entry {
  let e = store.get(ip);
  if (!e) {
    e = { fails: 0, windowStart: Date.now() };
    store.set(ip, e);
  }
  return e;
}

export function loginRateLimitStatus(ip: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const e = getEntry(ip);

  if (e.lockedUntil != null) {
    if (now < e.lockedUntil) {
      return { ok: false, retryAfterSec: Math.ceil((e.lockedUntil - now) / 1000) };
    }
    e.fails = 0;
    e.windowStart = now;
    e.lockedUntil = undefined;
  }

  if (now - e.windowStart > WINDOW_MS) {
    e.fails = 0;
    e.windowStart = now;
  }

  return { ok: true };
}

export function recordLoginFailure(ip: string): void {
  const now = Date.now();
  const e = getEntry(ip);
  if (now - e.windowStart > WINDOW_MS) {
    e.fails = 0;
    e.windowStart = now;
  }
  e.fails += 1;
  if (e.fails >= MAX_FAILS) {
    e.lockedUntil = now + LOCKOUT_MS;
  }
}

export function clearLoginFailures(ip: string): void {
  store.delete(ip);
}
