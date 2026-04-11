"use client";

import { useEffect, useState } from "react";

type Side = "axis" | "allies";

const sideUi: Record<
  Side,
  {
    title: string;
    subtitle: string;
    borderClass: string;
    labelClass: string;
  }
> = {
  axis: {
    title: "Axis strategist notes",
    subtitle:
      "Hidden until you reveal \u2014 another publisher on this page won\u2019t see this block until they click Reveal (same idea as the public log).",
    borderClass: "border-axis/40",
    labelClass: "text-axis",
  },
  allies: {
    title: "Allies strategist notes",
    subtitle:
      "Hidden until you reveal \u2014 independent from Axis; only shown after Reveal so co-publishers aren\u2019t shown the other side by accident.",
    borderClass: "border-allied/40",
    labelClass: "text-allied",
  },
};

type Props = {
  side: Side;
  name: "secretNotesAxis" | "secretNotesAllies";
  legend: string;
  hint: string;
  placeholder: string;
  initialValue: string;
  fieldClass: string;
  subClass: string;
  legClass: string;
  resetKey: string;
};

export function PublisherStrategistNotesField({
  side,
  name,
  legend,
  hint,
  placeholder,
  initialValue,
  fieldClass,
  subClass,
  legClass,
  resetKey,
}: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialValue);
  const c = sideUi[side];
  const idPrefix = `publish-${side}-${resetKey}`.replace(/[^a-zA-Z0-9-_]/g, "-");

  useEffect(() => {
    setValue(initialValue);
    setOpen(false);
  }, [initialValue, resetKey]);

  const collapsedTextarea =
    "m-0 max-h-0 min-h-0 resize-none overflow-hidden border-0 p-0 opacity-0 pointer-events-none";

  return (
    <fieldset
      className={`border border-dashed p-4 ${c.borderClass} bg-np-paper-dark`}
    >
      <legend className={legClass}>{legend}</legend>
      <p className={`mb-3 text-xs ${subClass}`}>{hint}</p>

      <div className={`border ${c.borderClass} bg-np-paper p-4`}>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold text-np-ink transition hover:text-np-red"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={`${idPrefix}-panel`}
          id={`${idPrefix}-toggle`}
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

        <div
          id={`${idPrefix}-panel`}
          role="region"
          aria-labelledby={`${idPrefix}-toggle`}
          className={open ? "mt-3" : ""}
        >
          <textarea
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={open ? 4 : 1}
            placeholder={placeholder}
            aria-label={legend}
            readOnly={!open}
            tabIndex={open ? 0 : -1}
            aria-hidden={!open}
            className={[
              fieldClass,
              !open ? collapsedTextarea : "",
            ].join(" ")}
          />
        </div>
      </div>
    </fieldset>
  );
}
