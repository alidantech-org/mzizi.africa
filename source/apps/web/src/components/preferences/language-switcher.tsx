"use client";
/** App-bar language switcher with search and an area filter. Only English and Kiswahili are available; the rest are a demo. */
import { Check, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TextField } from "#/components/ui/controls";
import { LANGUAGES, languagesForArea } from "#demo/_data/languages";
import { readLang, writeLang } from "#/lib/preferences/saved";
import { build } from "#/lib/navigation/route";
import { useNav } from "#/lib/navigation/use-ctx";
import { useRouter } from "next/navigation";
import { currentHash, keepScroll } from "#/lib/navigation/scroll";

export function LanguageSwitcher() {
  const nav = useNav();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [all, setAll] = useState(false);
  const [current, setCurrent] = useState("en");
  const [pos, setPos] = useState({ top: 44, right: 8 });
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => setCurrent(nav.ctx.lang ?? readLang()), [nav.ctx.lang]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);

  const county = nav.ctx.country === "ke" ? nav.ctx.trail[0] : undefined;
  const choose = (code: string) => {
    writeLang(code);
    setCurrent(code);
    setOpen(false);
    keepScroll();
    router.push(
      build({ ...nav.ctx, lang: code === "en" ? undefined : code }, { view: nav.ctx.view, params: nav.ctx.params }) +
        currentHash(),
      { scroll: false },
    );
  };
  const show = () => {
    const r = btn.current!.getBoundingClientRect();
    setPos({ top: r.bottom + 8, right: Math.max(8, innerWidth - r.right) });
    setQ("");
    setAll(false);
    setOpen(true);
  };

  const row = (l: (typeof LANGUAGES)[number]) => (
    <li key={l.code} role="option" aria-selected={current === l.code} aria-disabled={!l.available}>
      <button
        disabled={!l.available}
        onClick={() => choose(l.code)}
        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm ${l.available ? "hover:bg-accent-soft" : "opacity-50"}`}
      >
        <span className="flex-1">
          <span className="font-medium">{l.name}</span>
          <span className="ml-2 text-xs text-muted">{l.native}</span>
        </span>
        {current === l.code ? (
          <Check size={14} className="text-accent" />
        ) : (
          !l.available && <span className="rounded bg-line px-1.5 py-0.5 text-[10px]">Coming later</span>
        )}
      </button>
    </li>
  );
  const group = (title: string, items: typeof LANGUAGES) =>
    items.length > 0 && (
      <div key={title}>
        <div className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-muted">{title}</div>
        <ul role="listbox" aria-label={title}>
          {items.map(row)}
        </ul>
      </div>
    );

  // The short list first: what works now, then what is spoken around you. The rest is one tap away, so the popover rarely scrolls.
  const searching = q.trim().length > 0;
  const available = LANGUAGES.filter((l) => l.available);
  const around = languagesForArea(county).filter((l) => !l.available);
  const others = LANGUAGES.filter((l) => !l.available && !around.includes(l));
  const matches = LANGUAGES.filter((l) => `${l.name} ${l.native}`.toLowerCase().includes(q.toLowerCase()));

  const panel = open && (
    <>
      <div className="fixed inset-0 z-[60]" onMouseDown={() => setOpen(false)} />
      <div
        role="dialog"
        aria-label="Choose language"
        style={{ top: pos.top, right: pos.right }}
        className="floating fixed z-[61] max-h-[min(70vh,520px)] w-[min(340px,calc(100vw-16px))] overflow-y-auto overscroll-contain rounded-lg border border-line bg-surface"
      >
        <div className="sticky top-0 z-10 border-b border-line bg-surface p-3">
          <TextField
            label="Search languages"
            value={q}
            onChange={setQ}
            placeholder="Search languages"
            icon={<Search size={15} />}
            autoFocus
            size="sm"
          />
        </div>
        <div className="p-1.5">
          {searching ? (
            matches.length ? (
              group(`${matches.length} found`, matches)
            ) : (
              <p className="px-3 py-5 text-sm text-muted">No language matches.</p>
            )
          ) : (
            <>
              {group("Available", available)}
              {group(county ? "Spoken in this county" : "Spoken around you", around)}
              {others.length > 0 &&
                (all ? (
                  group("More languages", others)
                ) : (
                  <button
                    onClick={() => setAll(true)}
                    className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm text-accent hover:bg-accent-soft"
                  >
                    Show all languages ({others.length} more)
                  </button>
                ))}
            </>
          )}
        </div>
        <p className="border-t border-line px-3 py-2 text-xs text-muted">
          Choosing a language changes the interface only. Source evidence is not translated.
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
        aria-label={`Language: ${current.toUpperCase()}. Change language`}
        className="flex h-9 items-center rounded-md px-2.5 text-sm font-medium text-muted hover:bg-accent-soft hover:text-ink"
      >
        <span className="font-mono uppercase tracking-wider">{current}</span>
      </button>
      {typeof document !== "undefined" && panel && createPortal(panel, document.body)}
    </>
  );
}
