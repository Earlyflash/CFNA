"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * After navigation or hash change, scroll to `window.location.hash` if it matches an element id.
 */
export function ScrollToHash() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hashTick, setHashTick] = useState(0);

  useEffect(() => {
    const onHash = () => setHashTick((n) => n + 1);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;

    const el = document.getElementById(id);
    if (!el) return;

    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    return () => window.clearTimeout(t);
  }, [pathname, searchParams, hashTick]);

  return null;
}
