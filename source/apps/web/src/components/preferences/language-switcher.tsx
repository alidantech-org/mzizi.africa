"use client";
/** App-bar language switcher with search. The languages are the ones the backend has interface wording for. */
import { Check, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TextField } from "#/components/ui/controls";
import { copy } from "@mzizi/copy";
import { useCopy, useLanguage } from "#/lib/copy/copy";
import { usePlaceCatalogue, type CatalogueLanguage } from "#/lib/places/catalogue";
import { writeLang } from "#/lib/preferences/saved";
import { build } from "#/lib/navigation/route";
import { useNav } from "#/lib/navigation/use-ctx";
import { useRouter } from "next/navigation";
import { currentHash, keepScroll } from "#/lib/navigation/scroll";

export function LanguageSwitcher() {
  const nav = useNav();
  const t = useCopy();
  const { languages } = usePlaceCatalogue();
  const current = useLanguage(); // the language the server rendered this page in
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [pos, setPos] = useState({ top: 44, right: 8 });
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);

  const choose = (code: string) => {
    writeLang(code);
    setOpen(false);
    keepScroll();
    router.push(
      build({ ...nav.ctx, lang: code }, { view: nav.ctx.view, params: nav.ctx.params }) +
        currentHash(),
      { scroll: false },
    );
  };
  const show = () => {
    const r = btn.current!.getBoundingClientRect();
    setPos({ top: r.bottom + 8, right: Math.max(8, innerWidth - r.right) });
    setQ("");
    setOpen(true);
  };

  const row = (l: CatalogueLanguage) => (
    <li key={l.code} role="option" aria-selected={current === l.code}>
      <button
        onClick={() => choose(l.code)}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-accent-soft"
      >
        <span className="flex-1">
          <span className="font-medium">{l.name}</span>
        </span>
        {current === l.code && <Check size={14} className="text-accent" />}
      </button>
    </li>
  );
  const group = (title: string, items: CatalogueLanguage[]) =>
    items.length > 0 && (
      <div key={title}>
        <div className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-muted">{title}</div>
        <ul role="listbox" aria-label={title}>
          {items.map(row)}
        </ul>
      </div>
    );

  const searching = q.trim().length > 0;
  const matches = languages.filter((l) => l.name.toLowerCase().includes(q.trim().toLowerCase()));

  const panel = open && (
    <>
      <div className="fixed inset-0 z-[60]" onMouseDown={() => setOpen(false)} />
      <div
        role="dialog"
        aria-label={t(copy.menus.language.label)}
        style={{ top: pos.top, right: pos.right }}
        className="floating fixed z-[61] max-h-[min(70vh,520px)] w-[min(340px,calc(100vw-16px))] overflow-y-auto overscroll-contain rounded-lg border border-line bg-surface"
      >
        <div className="sticky top-0 z-10 border-b border-line bg-surface p-3">
          <TextField
            label={t(copy.menus.language.search)}
            value={q}
            onChange={setQ}
            placeholder={t(copy.menus.language.search)}
            icon={<Search size={15} />}
            autoFocus
            size="sm"
          />
        </div>
        <div className="p-1.5">
          {searching ? (
            matches.length ? (
              group(t(copy.menus.language.found, { count: matches.length }), matches)
            ) : (
              <p className="px-3 py-5 text-sm text-muted">{t(copy.menus.language.noMatch)}</p>
            )
          ) : (
            group(t(copy.menus.language.available), languages)
          )}
        </div>
        <p className="border-t border-line px-3 py-2 text-xs text-muted">
          {t(copy.menus.language.note)}
        </p>
      </div>
    </>
  );
  return (
    <>
      <button
        ref={btn}
        onClick={() => (open ? setOpen(false) : show())}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t(copy.menus.language.button, { code: current.toUpperCase() })}
        className="flex h-9 items-center rounded-md px-2.5 text-sm font-medium text-muted hover:bg-accent-soft hover:text-ink"
      >
        <span className="font-mono uppercase tracking-wider">{current}</span>
      </button>
      {typeof document !== "undefined" && panel && createPortal(panel, document.body)}
    </>
  );
}
