"use client";
/** Search across every real county, constituency, ward and institution. Press / to open. */
import { replaceQuery } from "#/lib/navigation/replace";
import { Mic, Search } from "lucide-react";
import { demoHref } from "#/lib/navigation/base";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { copy } from "@mzizi/copy";
import { useCopy } from "#/lib/copy/copy";
import { usePlaceCatalogue } from "#/lib/places/catalogue";
import { placeFromHref, useNav } from "#/lib/navigation/use-ctx";
import type { ViewId } from "#/lib/navigation/route";
import { useEffect, useMemo, useRef, useState } from "react";
import { getVoice, listen, speak } from "#/lib/accessibility/speech";

type Entry = { kind: string; name: string; where: string; href: string };

export function SearchDialog() {
  const t = useCopy();
  const nav = useNav();
  const next = useRouter();
  const router = { push: (href: string) => (href.includes("?") ? next.push(demoHref(href)) : nav.goPlace(placeFromHref(href))) };
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { entries, found } = usePlaceCatalogue();
  const path = usePathname();
  const sp = useSearchParams();
  /** The query is in the URL (`find`) so the server renders the matches; the dialog itself stays open. */
  const setFind = (value: string) => {
    const params = new URLSearchParams(location.search);
    params.delete("lvl");
    params.delete("pg");
    if (value.trim().length >= 2) params.set("find", value.trim());
    else params.delete("find");
    const qs = params.toString();
    replaceQuery(next, `${path}${qs ? `?${qs}` : ""}${location.hash}`);
  };
  const leaving = useRef(false); // a chosen result navigates itself; do not rewrite the old URL over it
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typed = (value: string) => {
    setQ(value);
    setActive(0);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setFind(value), 250);
  };
  const index: Entry[] = useMemo(() => {
    const seen = new Set<string>();
    return [...(found?.entries ?? []), ...entries].filter((e) => e.kind !== "Country" && !seen.has(e.href) && seen.add(e.href));
  }, [entries, found]);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const [heard, setHeard] = useState("");
  const [listening, setListening] = useState(false);
  const stop = useRef<(() => void) | null>(null);

  const startVoice = () => {
    setListening(true);
    setHeard("");
    stop.current = listen(
      (t, final) => {
        typed(t);
        if (final) setHeard(t);
      },
      () => setListening(false),
    );
    if (!stop.current) setListening(false);
  };
  useEffect(() => {
    const onEvent = (e: Event) => {
      setOpen(true);
      if ((e as CustomEvent).detail?.voice) setTimeout(startVoice, 60);
    };
    addEventListener("mzizi-app:search", onEvent);
    return () => removeEventListener("mzizi-app:search", onEvent);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea/i.test((e.target as HTMLElement).tagName);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open && !leaving.current && sp.get("find")) setFind("");
    leaving.current = false;
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 20);
  }, [open]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return index.filter((e) => e.href.split("/").filter(Boolean).length === 2).slice(0, 8); // the first level below the country
    if (s.length >= 2 && found && found.kind === null && found.query.toLowerCase() === s) return found.entries.slice(0, 12);
    const starts = index.filter((e) => e.name.toLowerCase().startsWith(s));
    const has = index.filter((e) => !e.name.toLowerCase().startsWith(s) && e.name.toLowerCase().includes(s));
    return [...starts, ...has].slice(0, 12);
  }, [q, index]);

  /** After a spoken query: go to a named page, or answer aloud and optionally open the best match. */
  useEffect(() => {
    if (!heard || !index.length) return;
    const said = heard.toLowerCase().trim();
    // Spoken page names are the sidebar names in the current language.
    const pages: Record<string, ViewId | "home"> = {
      [t(copy.preferences.voice.home).toLowerCase()]: "home",
      [t(copy.shell.link.overview).toLowerCase()]: "overview",
      ...Object.fromEntries(
        (Object.keys(copy.shell.link) as ViewId[]).map((v) => [t(copy.shell.link[v]).toLowerCase(), v] as const),
      ),
    };
    const { mode } = getVoice();
    if (pages[said]) {
      if (mode !== "off") speak(t(copy.preferences.voice.opening, { page: said }));
      setOpen(false);
      next.push(pages[said] === "home" ? "/demo" : nav.viewHref(pages[said] as ViewId));
      setHeard("");
      return;
    }
    const hit = index.filter((e) => e.name.toLowerCase().includes(said));
    const best = hit.find((e) => e.name.toLowerCase() === said) ?? hit[0];
    if (mode !== "off")
      speak(
        best
          ? t(hit.length === 1 ? copy.preferences.voice.resultOne : copy.preferences.voice.results, {
              count: hit.length,
              name: best.name,
              kind: best.kind.toLowerCase(),
              where: best.where,
            })
          : t(copy.preferences.voice.noMatch, { query: said }),
      );
    if (mode === "handsfree" && best) {
      setOpen(false);
      setQ("");
      router.push(best.href);
    }
    setHeard("");
  }, [heard, index, router]);

  const go = (e: Entry) => {
    leaving.current = true;
    if (timer.current) clearTimeout(timer.current);
    setOpen(false);
    setQ("");
    router.push(e.href);
  };

  return (
    <>
      <div className="flex h-8 w-full max-w-[17rem] items-center rounded-md border border-line bg-paper text-sm text-muted transition focus-within:border-accent hover:border-muted">
        <button
          onClick={() => setOpen(true)}
          className="flex h-full min-w-0 flex-1 items-center gap-2 rounded-l-md px-2.5 text-left"
        >
          <Search size={15} className="shrink-0" />
          <span className="truncate">{t(copy.search.field.placeholder)}</span>
          <kbd className="ml-auto shrink-0 rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[11px] leading-none">
            /
          </kbd>
        </button>
        <button
          onClick={() => dispatchEvent(new CustomEvent("mzizi-app:search", { detail: { voice: true } }))}
          aria-label={t(copy.search.field.byVoice)}
          title={t(copy.search.field.byVoice)}
          className="grid h-full w-8 shrink-0 place-items-center rounded-r-md border-l border-line hover:bg-accent-soft hover:text-ink"
        >
          <Mic size={16} />
        </button>
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-start justify-items-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-label={t(copy.search.dialog.label)}
            className="floating w-full max-w-xl overflow-hidden rounded-lg border border-line bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-5">
              <button
                onClick={startVoice}
                aria-label={t(copy.search.dialog.speak)}
                className={`grid size-7 place-items-center rounded-md ${listening ? "bg-accent text-paper" : "text-muted hover:bg-accent-soft"}`}
              >
                <Mic size={16} />
              </button>
              <input
                ref={input}
                value={q}
                onChange={(e) => typed(e.target.value)}
                placeholder={listening ? t(copy.search.dialog.listening) : t(copy.search.dialog.placeholder)}
                className="h-14 flex-1 bg-transparent outline-none placeholder:text-muted"
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => Math.min(a + 1, results.length - 1));
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) => Math.max(a - 1, 0));
                  }
                  if (e.key === "Enter" && results[active]) go(results[active]);
                }}
              />
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {!index.length && <li className="px-4 py-6 text-sm text-muted">{t(copy.search.dialog.loading)}</li>}
              {results.map((r, i) => (
                <li key={r.href + r.name}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r)}
                    className={`flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left ${i === active ? "bg-accent-soft" : ""}`}
                  >
                    <span className="w-24 shrink-0 truncate font-mono text-[10px] uppercase tracking-widest text-accent">{r.kind}</span>
                    <span className="min-w-0 truncate font-medium">{r.name}</span>
                    <span className="ml-auto max-w-[40%] shrink-0 truncate text-xs text-muted">{r.where}</span>
                  </button>
                </li>
              ))}
              {index.length > 0 && !results.length && <li className="px-4 py-6 text-sm text-muted">{t(copy.search.dialog.noMatch, { query: q })}</li>}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
