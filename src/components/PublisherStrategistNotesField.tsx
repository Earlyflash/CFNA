"use client";

import { useEffect, useState } from "react";

type Side = "axis" | "allies";

const sideUi: Record<
  Side,
  {
    title: string;
    subtitle: string;
    border: string;
    iconBg: string;
    iconBorder: string;
    fieldsetBorder: string;
    fieldsetBg: string;
  }
> = {
  axis: {
    title: "Axis strategist notes",
    subtitle:
      "Hidden until you reveal — another publisher on this page won’t see this block until they click Reveal (same idea as the public log).",
    border: "border-axis/25",
    iconBg: "bg-axis/15",
    iconBorder: "border-axis/40",
    fieldsetBorder: "border-axis/30",
    fieldsetBg: "bg-axis/5",
  },
  allies: {
    title: "Allies strategist notes",
    subtitle:
      "Hidden until you reveal — independent from Axis; only shown after Reveal so co-publishers aren’t shown the other side by accident.",
    border: "border-allied/25",
    iconBg: "bg-allied/10",
    iconBorder: "border-allied/35",
    fieldsetBorder: "border-allied/30",
    fieldsetBg: "bg-allied/5",
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
  /** Reset open state and value when switching entries. */
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
      className={`rounded-xl border border-dashed p-4 ${c.fieldsetBorder} ${c.fieldsetBg}`}
    >
      <legend className={legClass}>{legend}</legend>
      <p className={`mb-3 text-xs ${subClass}`}>{hint}</p>

      <div className={`rounded-2xl border bg-gradient-to-br from-wwam-void/25 to-transparent p-4 ${c.border}`}>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-left text-sm font-semibold text-wwam-ink transition hover:bg-wwam-gold/10"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={`${idPrefix}-panel`}
          id={`${idPrefix}-toggle`}
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
