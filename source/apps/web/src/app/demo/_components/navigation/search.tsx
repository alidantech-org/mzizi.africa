"use client";
/** Search across every real county, constituency, ward and institution. Press / to open. */
import { Mic, Search } from "lucide-react";
import { demoHref } from "#demo/_lib/navigation/base";
import { useRouter } from "next/navigation";
import { placeFromHref, useNav } from "#demo/_lib/navigation/use-ctx";
import type { ViewId } from "#demo/_lib/navigation/route";
import { useEffect, useMemo, useRef, useState } from "react";
import { getVoice, listen, speak } from "#demo/_lib/accessibility/speech";

type Entry = { kind: string; name: string; where: string; href: string };

export function SearchDialog() {
  const nav = useNav();
  const next = useRouter();
  const router = { push: (href: string) => (href.includes("?") ? next.push(demoHref(href)) : nav.goPlace(placeFromHref(href))) };
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [index, setIndex] = useState<Entry[]>([]);
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
        setQ(t);
        setActive(0);
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
    addEventListener("mzizi-demo:search", onEvent);
    return () => removeEventListener("mzizi-demo:search", onEvent);
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
    if (!open || index.length) return;
    Promise.all([import("#demo/_data/places"), import("#demo/_data/generated/governance.json")]).then(([p, g]) => {
      const inst = (g.default as { institutions: { code: string; name: string }[] }).institutions.map((i) => ({
        kind: "Institution",
        name: i.name,
        where: "Public body",
        href: `/ke?view=institutions&view.entity=institution&view.id=${i.code}`,
      }));
      setIndex([...p.searchEntries(), ...inst]);
    });
  }, [open, index.length]);

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 20);
  }, [open]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return index.filter((e) => e.kind === "County").slice(0, 8);
    const starts = index.filter((e) => e.name.toLowerCase().startsWith(s));
    const has = index.filter((e) => !e.name.toLowerCase().startsWith(s) && e.name.toLowerCase().includes(s));
    return [...starts, ...has].slice(0, 12);
  }, [q, index]);

  /** After a spoken query: go to a named page, or answer aloud and optionally open the best match. */
  useEffect(() => {
    if (!heard || !index.length) return;
    const said = heard
      .toLowerCase()
      .replace(/^(go to|open|show me|take me to)\s+/, "")
      .trim();
    const pages: Record<string, ViewId | "home"> = {
      home: "home",
      overview: "overview",
      leaders: "leaders",
      elections: "elections",
      parliament: "parliament",
      institutions: "institutions",
      law: "law",
      constitution: "law",
      statistics: "statistics",
      compare: "compare",
      sources: "sources",
      money: "finance",
      finance: "finance",
      "three arms": "arms",
      "power model": "power",
    };
    const { mode } = getVoice();
    if (pages[said]) {
      if (mode !== "off") speak(`Opening ${said}`);
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
          ? `${hit.length} ${hit.length === 1 ? "result" : "results"}. Best match: ${best.name}, a ${best.kind.toLowerCase()} in ${best.where}.`
          : `Nothing matches ${said}.`,
      );
    if (mode === "handsfree" && best) {
      setOpen(false);
      setQ("");
      router.push(best.href);
    }
    setHeard("");
  }, [heard, index, router]);

  const go = (e: Entry) => {
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
          <span className="truncate">Search places, institutions…</span>
          <kbd className="ml-auto shrink-0 rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[11px] leading-none">
            /
          </kbd>
        </button>
        <button
          onClick={() => dispatchEvent(new CustomEvent("mzizi-demo:search", { detail: { voice: true } }))}
          aria-label="Search by voice"
          title="Search by voice"
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
            aria-label="Search"
            className="floating w-full max-w-xl overflow-hidden rounded-lg border border-line bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-5">
              <button
                onClick={startVoice}
                aria-label="Speak your search"
                className={`grid size-7 place-items-center rounded-md ${listening ? "bg-accent text-paper" : "text-muted hover:bg-accent-soft"}`}
              >
                <Mic size={16} />
              </button>
              <input
                ref={input}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                placeholder={listening ? "Listening…" : "A county, constituency, ward or public body"}
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
              {!index.length && <li className="px-4 py-6 text-sm text-muted">Loading places…</li>}
              {results.map((r, i) => (
                <li key={r.href + r.name}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r)}
                    className={`flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left ${i === active ? "bg-accent-soft" : ""}`}
                  >
                    <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-widest text-accent">{r.kind}</span>
                    <span className="font-medium">{r.name}</span>
                    <span className="ml-auto truncate text-xs text-muted">{r.where}</span>
                  </button>
                </li>
              ))}
              {index.length > 0 && !results.length && <li className="px-4 py-6 text-sm text-muted">Nothing matches “{q}”.</li>}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
