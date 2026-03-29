"use client";

import { useState } from "react";

type Side = "axis" | "allies";

const sideConfig: Record<
  Side,
  {
    title: string;
    subtitle: string;
    border: string;
    iconBg: string;
    iconBorder: string;
    panelBorder: string;
  }
> = {
  axis: {
    title: "Axis strategist notes",
    subtitle: "Hidden until you reveal — Axis plans, experiments, hunches",
    border: "border-axis/25",
    iconBg: "bg-axis/15",
    iconBorder: "border-axis/40",
    panelBorder: "border-axis/30",
  },
  allies: {
    title: "Allies strategist notes",
    subtitle: "Hidden until you reveal — Commonwealth plans, experiments, hunches",
    border: "border-allied/25",
    iconBg: "bg-allied/10",
    iconBorder: "border-allied/35",
    panelBorder: "border-allied/30",
  },
};

type Props = {
  text: string | null;
  /** Unique prefix for aria ids (e.g. session id + side). */
  idPrefix: string;
  side: Side;
};

export function SecretNotesReveal({ text, idPrefix, side }: Props) {
  const trimmed = text?.trim() ?? "";
  const [open, setOpen] = useState(false);
  const c = sideConfig[side];

  if (!trimmed) return null;

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br from-wwam-void/25 to-transparent p-4 ${c.border}`}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-left text-sm font-semibold text-wwam-ink transition hover:bg-wwam-gold/10"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${idPrefix}-secret-panel`}
        id={`${idPrefix}-secret-toggle`}
      >
        <span className="flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-wwam-ink ${c.iconBorder} ${c.iconBg}`}
            aria-hidden
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </span>
          <span>
            {c.title}
            <span className="mt-0.5 block text-xs font-normal text-wwam-dune">{c.subtitle}</span>
          </span>
        </span>
        <span className="shrink-0 font-mono text-xs text-wwam-dune">{open ? "Hide" : "Reveal"}</span>
      </button>
      {open ? (
        <div
          id={`${idPrefix}-secret-panel`}
          role="region"
          aria-labelledby={`${idPrefix}-secret-toggle`}
          className={`mt-3 whitespace-pre-wrap rounded-xl border bg-wwam-cream/90 p-4 text-sm leading-relaxed text-wwam-ink shadow-inner ${c.panelBorder}`}
        >
          {trimmed}
        </div>
      ) : null}
    </div>
  );
}
