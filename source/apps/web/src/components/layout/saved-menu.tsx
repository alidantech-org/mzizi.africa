"use client";
/** Saved places: a drop-down with the first few and a link to see and manage them all. */
import { copy } from "@mzizi/copy";
import { useCopy } from "#/lib/copy/copy";
import { Bookmark } from "lucide-react";
import Link from "#/components/navigation/demo-link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePlaceNames } from "#/lib/places/catalogue";
import { readHideCount, readSaved, writeHideCount, type Saved } from "#/lib/preferences/saved";
import { placeFromHref, useNav } from "#/lib/navigation/use-ctx";
import { Checkbox } from "#/components/ui/controls";

const SHOWN = 5;

export function SavedMenu() {
  const nav = useNav();
  const t = useCopy();
  const names = usePlaceNames();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<Saved[]>([]);
  const [pos, setPos] = useState({ top: 48, right: 8 });
  const btn = useRef<HTMLButtonElement>(null);
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const sync = () => setHide(readHideCount());
    setSaved(readSaved());
    sync();
    addEventListener("mzizi-app:count", sync);
    return () => removeEventListener("mzizi-app:count", sync);
  }, []);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);
  const show = () => {
    setSaved(readSaved());
    setHide(readHideCount());
    const r = btn.current!.getBoundingClientRect();
    setPos({ top: r.bottom + 8, right: Math.max(8, innerWidth - r.right) });
    setOpen(true);
  };

  const nameOf = (path: string) => names.nameOf(placeFromHref(path));
  const where = (path: string) => names.parentsOf(placeFromHref(path)).join(" › ");
  const shown = saved.slice(0, SHOWN);

  const panel = open && (
    <>
      <div className="fixed inset-0 z-[60]" onMouseDown={() => setOpen(false)} />
      <div
        role="menu"
        aria-label={t(copy.menus.saved.label)}
        style={{ top: pos.top, right: pos.right }}
        className="floating fixed z-[61] w-72 rounded-lg border border-line bg-surface p-1.5"
      >
        <div className="px-3 pb-1 pt-1.5 font-mono text-[10px] uppercase tracking-widest text-muted truncate">{t(copy.menus.saved.label)}</div>
        {shown.length === 0 && <p className="truncate px-3 py-3 text-sm text-muted">{t(copy.menus.saved.empty)}</p>}
        {shown.map((s) => (
          <button
            key={s.path}
            role="menuitem"
            onClick={() => {
              setOpen(false);
              nav.goPlace(placeFromHref(s.path));
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent-soft"
          >
            <span className="min-w-0 flex-1 truncate" title={where(s.path)}>
              {nameOf(s.path)}
            </span>
            {s.label && (
              <span className="shrink-0 rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                {s.label === "Home" ? t(copy.menus.saved.home) : s.label}
              </span>
            )}
          </button>
        ))}
        <div className="mt-1 flex min-w-0 items-center justify-between gap-2 border-t border-line px-3 py-2">
          <Checkbox
            size="sm"
            selected={hide}
            onChange={(v) => {
              setHide(v);
              writeHideCount(v);
            }}
          >
            {t(copy.menus.saved.hideCount)}
          </Checkbox>
          <Link
            role="menuitem"
            href="/me/saved"
            onClick={() => setOpen(false)}
            className="min-w-0 shrink-0 truncate text-xs font-medium text-accent hover:underline"
          >
            {t(copy.menus.saved.viewAll)}
          </Link>
        </div>
      </div>
    </>
  );
  return (
    <>
      <button
        ref={btn}
        onClick={() => (open ? setOpen(false) : show())}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={saved.length && !hide ? t(copy.menus.saved.labelWithCount, { count: saved.length }) : t(copy.menus.saved.label)}
        title={t(copy.menus.saved.label)}
        className="relative grid size-9 place-items-center rounded-md text-muted hover:bg-accent-soft hover:text-ink"
      >
        <Bookmark size={18} />
        {saved.length > 0 && !hide && (
          <span className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-medium leading-4 text-paper">
            {saved.length}
          </span>
        )}
      </button>
      {typeof document !== "undefined" && panel && createPortal(panel, document.body)}
    </>
  );
}
