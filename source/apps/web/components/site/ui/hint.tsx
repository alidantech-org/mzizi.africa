"use client";

import { useId, useState, type ReactNode } from "react";

import { Icon } from "#/components/brand/icon.tsx";

/** A small "what does this mean?" mark. Opens on hover, focus or tap, and is read aloud by screen readers. */
export function Hint({ children, label = "What does this mean?" }: { children: ReactNode; label?: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex align-middle" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" aria-label={label} aria-describedby={open ? id : undefined} aria-expanded={open} onClick={() => setOpen(!open)} onBlur={() => setOpen(false)} className="grid h-5 w-5 place-items-center rounded-full text-content-muted hover:text-clay">
        <Icon name="info" size={16} />
      </button>
      {open ? (
        <span role="tooltip" id={id} className="glass-strong absolute left-1/2 top-full z-40 mt-2 w-60 -translate-x-1/2 rounded-2xl p-3 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-content-primary">
          {children}
        </span>
      ) : null}
    </span>
  );
}

/** A "Did you know?" card. */
export function DidYouKnow({ title = "Did you know?", children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="glass card flex gap-3 border-l-4" style={{ borderLeftColor: "var(--calabash)" }}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-calabash/20 text-calabash"><Icon name="bulb" size={22} /></span>
      <div><p className="kicker" style={{ color: "var(--calabash)" }}>{title}</p><div className="mt-1 text-sm">{children}</div></div>
    </aside>
  );
}
