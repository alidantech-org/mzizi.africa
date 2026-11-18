"use client";

/** Search across everything: type for a labelled, grouped list; Enter opens the full results page. Press "/" to focus. */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Avatar } from "#/components/site/ui/media.tsx";
import { hrefFor } from "#/lib/site/hit-links.ts";
import { search, type SearchResults } from "#/lib/site/insights.ts";
import { useLanguage } from "#/lib/site/i18n.tsx";

const ICON: Record<string, string> = { place: "📍", leader: "👤", party: "🏛", project: "🏗", tender: "📄", indicator: "📊", source: "📚", law: "⚖" };

export function GlobalSearchBox({ compact = false, autoFocus = false }: { compact?: boolean; autoFocus?: boolean }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [text, setText] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        event.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (text.trim().length < 2) { setResults(null); return; }
    const timer = setTimeout(() => {
      search(text.trim(), undefined, 12).then((r) => { setResults(r); setError(""); }, (e: Error) => setError(e.message));
    }, 220);
    return () => clearTimeout(timer);
  }, [text]);

  const go = () => { if (text.trim()) { setOpen(false); router.push(`/search?q=${encodeURIComponent(text.trim())}`); } };
  return (
    <div className="relative w-full">
      <form role="search" onSubmit={(e) => { e.preventDefault(); go(); }}>
        <label className="sr-only" htmlFor="global-search">{t("searchEverything")}</label>
        <div className={`glass flex items-center gap-2 rounded-full px-4 ${compact ? "py-1.5" : "py-3"}`}>
          <span aria-hidden>🔎</span>
          <input id="global-search" ref={input} value={text} autoFocus={autoFocus} onChange={(e) => { setText(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 160)} placeholder={t("searchEverything")} autoComplete="off" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-content-muted" />
          <kbd aria-hidden className="hidden rounded-md border border-border-default px-1.5 text-[10px] text-content-muted sm:block">/</kbd>
        </div>
      </form>
      {open && (results || error) ? (
        <div className="glass-strong absolute left-0 right-0 top-full z-30 mt-2 max-h-[70vh] overflow-auto rounded-3xl p-2">
          {error ? <p className="p-3 text-sm text-danger">{error}</p> : null}
          {results && results.hits.length === 0 ? <p className="p-3 text-sm text-content-muted">Nothing matches “{results.query}”.</p> : null}
          {results?.hits.map((hit) => (
            <Link key={`${hit.kind}-${hit.id}`} href={hrefFor(hit)} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-2xl px-3 py-2 hover:bg-surface-sunken">
              {hit.kind === "leader" ? <Avatar src={hit.imageUrl} name={hit.title} size={32} /> : <span aria-hidden className="grid h-8 w-8 place-items-center text-lg">{ICON[hit.kind] ?? "•"}</span>}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{hit.title}</span>
                <span className="block truncate text-xs text-content-muted">{hit.subtitle ?? ""}{hit.path.length > 1 ? ` · ${hit.path.slice(1).join(" › ")}` : ""}</span>
              </span>
              <span className="chip shrink-0">{hit.kindLabel}</span>
            </Link>
          ))}
          {results && results.hits.length > 0 ? (
            <button type="button" onMouseDown={go} className="mt-1 w-full rounded-2xl px-3 py-2 text-left text-sm font-semibold text-clay hover:bg-surface-sunken">See all {results.total} results →</button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
