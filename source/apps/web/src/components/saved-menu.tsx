"use client";
/** Saved places: a drop-down with the first few and a link to see and manage them all. */
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { resolvePlace } from "#/data/places";
import { prettify } from "#/lib/route";
import { readHideCount, readSaved, writeHideCount, type Saved } from "#/lib/saved";
import { placeFromHref, useNav } from "#/lib/use-ctx";
import { Checkbox } from "./controls";

const SHOWN = 5;

export function SavedMenu() {
  const nav = useNav();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<Saved[]>([]);
  const [pos, setPos] = useState({ top: 48, right: 8 });
  const btn = useRef<HTMLButtonElement>(null);
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const sync = () => setHide(readHideCount());
    setSaved(readSaved()); sync(); addEventListener("mzizi:count", sync);
    return () => removeEventListener("mzizi:count", sync);
  }, []);
  useEffect(() => { if (!open) return; const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false); addEventListener("keydown", esc); return () => removeEventListener("keydown", esc); }, [open]);
  const show = () => { setSaved(readSaved()); setHide(readHideCount()); const r = btn.current!.getBoundingClientRect(); setPos({ top: r.bottom + 8, right: Math.max(8, innerWidth - r.right) }); setOpen(true); };

  const nameOf = (path: string) => { const p = placeFromHref(path); const r = resolvePlace(p.country, p.trail); return r.ok ? (r.trail.at(-1)?.name ?? r.countryName) : prettify(p.trail.at(-1) ?? p.country); };
  const where = (path: string) => { const p = placeFromHref(path); const r = resolvePlace(p.country, p.trail); return r.ok ? [r.countryName, ...r.trail.slice(0, -1).map((t) => t.name)].join(" › ") : ""; };
  const shown = saved.slice(0, SHOWN);

  const panel = open && (
    <>
      <div className="fixed inset-0 z-[60]" onMouseDown={() => setOpen(false)} />
      <div role="menu" aria-label="Saved places" style={{ top: pos.top, right: pos.right }} className="floating fixed z-[61] w-72 rounded-lg border border-line bg-surface p-1.5">
        <div className="px-3 pb-1 pt-1.5 font-mono text-[10px] uppercase tracking-widest text-muted">Saved places</div>
        {shown.length === 0 && <p className="px-3 py-3 text-sm text-muted">Nothing saved yet.</p>}
        {shown.map((s) => (
          <button key={s.path} role="menuitem" onClick={() => { setOpen(false); nav.goPlace(placeFromHref(s.path)); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent-soft">
            <span className="min-w-0 flex-1 truncate" title={where(s.path)}>{nameOf(s.path)}</span>{s.label && <span className="shrink-0 rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">{s.label}</span>}
          </button>
        ))}
        <div className="mt-1 flex items-center justify-between border-t border-line px-3 py-2">
          <Checkbox size="sm" selected={hide} onChange={(v) => { setHide(v); writeHideCount(v); }}>Hide count</Checkbox>
          <Link role="menuitem" href="/me/saved" onClick={() => setOpen(false)} className="text-xs font-medium text-accent hover:underline">View all →</Link>
        </div>
      </div>
    </>
  );
  return (
    <>
      <button ref={btn} onClick={() => (open ? setOpen(false) : show())} aria-expanded={open} aria-haspopup="menu" aria-label={`Saved places${saved.length && !hide ? `, ${saved.length}` : ""}`} title="Saved places" className="relative grid size-9 place-items-center rounded-md text-muted hover:bg-accent-soft hover:text-ink">
        <Bookmark size={18} />{saved.length > 0 && !hide && <span className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-medium leading-4 text-paper">{saved.length}</span>}
      </button>
      {typeof document !== "undefined" && panel && createPortal(panel, document.body)}
    </>
  );
}
