"use client";

import { useState } from "react";

type Side = "axis" | "allies";

const sideConfig: Record<
  Side,
  {
    title: string;
    subtitle: string;
    borderClass: string;
    labelClass: string;
  }
> = {
  axis: {
    title: "Axis Strategist Notes",
    subtitle: "Hidden until you reveal — Axis plans, experiments, hunches",
    borderClass: "border-axis/40",
    labelClass: "text-axis",
  },
  allies: {
    title: "Allies Strategist Notes",
    subtitle: "Hidden until you reveal — Commonwealth plans, experiments, hunches",
    borderClass: "border-allied/40",
    labelClass: "text-allied",
  },
};

type Props = {
  text: string | null;
  idPrefix: string;
  side: Side;
};

export function SecretNotesReveal({ text, idPrefix, side }: Props) {
  const trimmed = text?.trim() ?? "";
  const [open, setOpen] = useState(false);
  const c = sideConfig[side];

  if (!trimmed) return null;

  return (
    <div className={`border ${c.borderClass} bg-np-paper-dark p-4`}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold text-np-ink transition hover:text-np-red"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${idPrefix}-secret-panel`}
        id={`${idPrefix}-secret-toggle`}
      >
        <span className="flex items-center gap-2.5">
          <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${c.labelClass}`} aria-hidden>
            Classified
          </span>
          <span>
            {c.title}
            <span className="mt-0.5 block text-xs font-normal text-np-ink-muted">{c.subtitle}</span>
          </span>
        </span>
        <span className="shrink-0 font-mono text-xs text-np-ink-muted">{open ? "Hide" : "Reveal"}</span>
      </button>
      {open ? (
        <div
          id={`${idPrefix}-secret-panel`}
          role="region"
          aria-labelledby={`${idPrefix}-secret-toggle`}
          className="mt-3 whitespace-pre-wrap border-t border-np-rule-light bg-np-paper p-4 text-sm leading-relaxed text-np-ink-light"
        >
          {trimmed}
        </div>
      ) : null}
    </div>
  );
}
