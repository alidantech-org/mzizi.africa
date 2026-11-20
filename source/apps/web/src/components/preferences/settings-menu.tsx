"use client";
/** Appearance and accessibility popover: a Theme tab and a Sound tab, with Reset and a link to the full preferences page in the footer. */
import { copy } from "@mzizi/copy";
import { useCopy } from "#/lib/copy/copy";
import { Accessibility } from "lucide-react";
import Link from "#/components/navigation/demo-link";
import { useEffect, useRef, useState } from "react";
import { resetPrefs } from "#/lib/preferences/prefs";
import { AudioPanel, LookPanel } from "#/components/preferences/prefs-panels";

type Tab = "look" | "audio";

export function SettingsMenu({ placement }: { placement: "top" | "bottom" }) {
  const t = useCopy();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("look");
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("mousedown", away);
    addEventListener("keydown", esc);
    return () => {
      removeEventListener("mousedown", away);
      removeEventListener("keydown", esc);
    };
  }, [open]);

  const tabBtn = (id: Tab, label: string) => (
    <button
      role="tab"
      aria-selected={tab === id}
      id={`prefs-tab-${id}`}
      aria-controls={`prefs-panel-${id}`}
      onClick={() => setTab(id)}
      className={`-mb-px flex-1 border-b-2 py-2.5 text-center text-sm transition ${tab === id ? "border-accent font-medium text-ink" : "border-transparent text-muted hover:text-ink"}`}
    >
      {label}
    </button>
  );
  return (
    <div ref={box} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={t(copy.menus.settings.label)}
        title={t(copy.menus.settings.label)}
        className="grid size-9 place-items-center rounded-md text-muted hover:bg-accent-soft hover:text-ink"
      >
        <Accessibility size={18} />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label={t(copy.menus.settings.label)}
          className={`floating absolute z-50 flex max-h-[80vh] w-[320px] flex-col overflow-hidden rounded-lg border border-line bg-surface ${placement === "top" ? "bottom-full left-0 mb-2" : "right-0 top-full mt-2"}`}
        >
          <div
            role="tablist"
            aria-label={t(copy.menus.settings.tabs)}
            className="sticky top-0 z-10 flex shrink-0 border-b border-line bg-surface"
          >
            {tabBtn("look", t(copy.menus.settings.theme))}
            {tabBtn("audio", t(copy.menus.settings.sound))}
          </div>
          <div
            role="tabpanel"
            id={`prefs-panel-${tab}`}
            aria-labelledby={`prefs-tab-${tab}`}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3"
          >
            {tab === "look" ? <LookPanel /> : <AudioPanel />}
          </div>
          <div className="flex shrink-0 items-center justify-between border-t border-line px-3 py-2">
            <button onClick={resetPrefs} className="text-xs text-muted hover:text-ink">
              {t(copy.menus.settings.reset)}
            </button>
            <Link href="/me" onClick={() => setOpen(false)} className="text-xs font-medium text-accent hover:underline">
              {t(copy.menus.settings.manage)}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
