"use client";
/** Help menu: reference and personal pages in one place, plus the keyboard shortcuts. */
import { copy } from "@mzizi/copy";
import { useCopy } from "#/lib/copy/copy";
import { CircleHelp, Keyboard, Library, SlidersHorizontal } from "lucide-react";
import Link from "#/components/navigation/demo-link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNav } from "#/lib/navigation/use-ctx";
import { Keys } from "#/components/accessibility/keys";
import { InstallApp } from "#/components/layout/pwa";

export function HelpMenu() {
  const nav = useNav();
  const t = useCopy();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 48, right: 8 });
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);
  const show = () => {
    const r = btn.current!.getBoundingClientRect();
    setPos({ top: r.bottom + 8, right: Math.max(8, innerWidth - r.right) });
    setOpen(true);
  };
  const item = "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent-soft";
  const panel = open && (
    <>
      <div className="fixed inset-0 z-[60]" onMouseDown={() => setOpen(false)} />
      <div
        role="menu"
        aria-label={t(copy.menus.help.label)}
        style={{ top: pos.top, right: pos.right }}
        className="floating fixed z-[61] w-72 rounded-lg border border-line bg-surface p-1.5"
      >
        <Link role="menuitem" href="/help" onClick={() => setOpen(false)} className={item}>
          <CircleHelp size={16} className="text-muted" />
          {t(copy.menus.help.help)}
        </Link>
        <Link role="menuitem" href={nav.viewHref("sources")} onClick={() => setOpen(false)} className={item}>
          <Library size={16} className="text-muted" />
          {t(copy.shell.link.sources)}
        </Link>
        <Link role="menuitem" href="/me" onClick={() => setOpen(false)} className={item}>
          <SlidersHorizontal size={16} className="text-muted" />
          {t(copy.menus.help.preferences)}
        </Link>
        <div className="px-1">
          <InstallApp />
        </div>
        <div className="mt-1 border-t border-line px-3 pb-2 pt-3">
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
            <Keyboard size={14} />
            {t(copy.menus.help.shortcuts)}
          </div>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center justify-between gap-4">
              <span>{t(copy.menus.help.searchPlaces)}</span>
              <Keys keys={["/"]} />
            </li>
            <li className="flex items-center justify-between gap-4">
              <span>{t(copy.menus.help.toggleSidebar)}</span>
              <Keys keys={["Ctrl", "B"]} />
            </li>
          </ul>
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
        aria-label={t(copy.menus.help.label)}
        title={t(copy.menus.help.label)}
        className="grid size-9 place-items-center rounded-md text-muted hover:bg-accent-soft hover:text-ink"
      >
        <CircleHelp size={18} />
      </button>
      {typeof document !== "undefined" && panel && createPortal(panel, document.body)}
    </>
  );
}
