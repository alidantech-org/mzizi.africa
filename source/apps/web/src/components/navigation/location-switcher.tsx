"use client";
/**
 * Location switcher.
 *
 * Header: a small country switcher and the breadcrumb of the current place. When the trail is wider than the header it
 * collapses to  Country > … > last  (click the … to show it all).
 * Below it: the search box with voice, and the level chips (collapsed while the list is scrolled so the header stays short).
 *
 * What the list shows
 *  - A level chip (County, Constituency, Ward): ALL places of that level in the country, never narrowed by where you
 *    are. Places relevant to the current place come first (the current one on top, then those inside the same county,
 *    constituency and so on), so nothing is hidden, only ordered. Lists are paged (Prev/Next): much cheaper than
 *    scrolling through 1,450 wards.
 *  - No chip ("All levels"): the children of the current place, i.e. the NEXT level down. At a ward, which has none, it
 *    shows the sibling wards with the current one on top. A search looks across every level of the country.
 *
 * Auto-narrow: choosing a place that has finer levels moves there but keeps the panel open, resets the level chip and
 * shows that place's children, so you can drill Kenya > Kilifi > Ganze > a ward in one go. Choosing a place with
 * nothing below it (or a saved or recent place) closes the panel.
 */
import { replaceQuery } from "#/lib/navigation/replace";
import {
  Bookmark,
  Building2,
  Check,
  ChevronLeft,
  Crosshair,
  Loader2,
  ChevronRight,
  Clock,
  Landmark,
  MapPin,
  MapPinned,
  Mic,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { getVoice, listen, speak } from "#/lib/accessibility/speech";
import { demoSegments } from "#/lib/navigation/base";
import { prettify } from "#/lib/navigation/route";
import { copy } from "@mzizi/copy";
import { useCopy } from "#/lib/copy/copy";
import { usePlaceCatalogue } from "#/lib/places/catalogue";
import { locate } from "#/lib/places/locate";
import { useLanguage } from "#/lib/copy/copy";
import { readSaved as readSavedList } from "#/lib/preferences/saved";
import { placeFromHref, useNav } from "#/lib/navigation/use-ctx";
import { TextField } from "#/components/ui/controls";
import { Flag } from "#/components/brand/flag";

type Entry = { kind: string; name: string; where: string; href: string; tag?: string };

/** A filled up-and-down caret: the "you can switch this" mark used for the country switcher. */
const Caret = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 10 14" width="9" height="12" fill="currentColor" aria-hidden className={className}>
    <path d="M5 0.5 9.2 5.6H0.8Z" />
    <path d="M5 13.5 0.8 8.4H9.2Z" />
  </svg>
);

/** Avatar for a place row. There are no real pictures for counties, wards and so on, so each kind gets its own icon; countries get their flag. */
function Avatar({ href }: { href: string }) {
  const depth = demoSegments(href).length - 1; // 0 is the country, 1 its first level, and so on
  if (depth === 0) return <Flag code={demoSegments(href)[0] ?? ""} size={22} />;
  const Icon = depth === 1 ? Building2 : depth === 2 ? Landmark : depth === 3 ? MapPin : MapPinned;
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">
      <Icon size={14} />
    </span>
  );
}
const RECENT = "mzizi-app-recent";
const SIZE = "mzizi-app-loc-size";
const MIN = { w: 320, h: 240 }; // let go below this and the panel hides
const PAGE = 25;
const read = (key: string): string[] => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
};
const segs = demoSegments;

export function LocationSwitcher({ compact }: { compact: boolean }) {
  const t = useCopy();
  const nav = useNav();
  const { ctx } = nav;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("all");
  const [page, setPage] = useState(0);
  const [active, setActive] = useState(0);
  const [listening, setListening] = useState(false);
  const { countries: COUNTRIES, entries, found } = usePlaceCatalogue();
  const router = useRouter();
  const path = usePathname();
  const language = useLanguage();
  const [locating, setLocating] = useState<"idle" | "busy" | "failed">("idle");
  const useDevice = async () => {
    setLocating("busy");
    const found = await locate({ languageCode: language });
    if (found.status !== "found") return setLocating("failed");
    setLocating("idle");
    go(found.href, false);
  };
  const [recent, setRecent] = useState<string[]>([]);
  const [saved, setSaved] = useState<{ path: string; label: string }[]>([]);
  const [bc, setBc] = useState(ctx.country); // the country being browsed
  const [picking, setPicking] = useState(false);
  const [cq, setCq] = useState("");
  const [size, setSize] = useState({ w: 560, h: 560 });
  const [pos, setPos] = useState({ left: 8, bottom: 8 });
  const [drag, setDrag] = useState<"none" | "ok" | "hide">("none");
  const [scrolled, setScrolled] = useState(false);
  const [chipFit, setChipFit] = useState<number | null>(null); // how many chips fit; null while measuring
  const [moreOpen, setMoreOpen] = useState(false);
  const chipRow = useRef<HTMLDivElement>(null);
  const [crumbs, setCrumbs] = useState<"full" | "collapsed" | "expanded">("full");
  const button = useRef<HTMLButtonElement>(null);
  const stop = useRef<(() => void) | null>(null);
  const crumbRow = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const names = useMemo(() => new Map(entries.map((e) => [e.href.split("?")[0], e.name])), [entries]);
  const countryDef = COUNTRIES.find((c) => c.code === bc) ?? COUNTRIES[0] ?? { code: bc, iso: bc.toUpperCase(), name: bc.toUpperCase(), levels: [] };
  const levels = countryDef.levels;
  const levelDefs = countryDef.levelDefs;
  const kindMode = levelDefs.some((l) => l.code === level);
  const searchMode = q.trim().length >= 2;
  const leafDepth = 1 + levels.length; // path segments of the deepest level
  const inCountry = useMemo(() => entries.filter((e) => e.kind !== "Country" && segs(e.href)[0] === bc), [entries, bc]);

  const place = () => {
    const r = button.current!.getBoundingClientRect();
    setPos({
      left: Math.max(8, Math.min(compact ? r.right + 8 : r.left, innerWidth - 328)),
      bottom: Math.max(8, innerHeight - r.bottom),
    });
  };
  const fit = (s: { w: number; h: number }) => ({ w: Math.min(s.w, innerWidth - 16), h: Math.min(s.h, innerHeight - 16) });
  const reset = () => {
    setQ("");
    setLevel("all");
    setPage(0);
    setActive(0);
    setScrolled(false);
    listRef.current?.scrollTo({ top: 0 });
  };
  const show = () => {
    place();
    setRecent(read(RECENT));
    setSaved(readSavedList());
    reset();
    setBc(ctx.country);
    setPicking(false);
    setCq("");
    setCrumbs("full");
    try {
      const s = JSON.parse(localStorage.getItem(SIZE) ?? "null");
      if (s) setSize(fit(s));
    } catch {}
    setOpen(true);
  };
  /** The location list is read on the server: its level, search text and page live in the address (`lvl`, `find`, `pg`). */
  const sync = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(location.search);
    for (const [k, v] of Object.entries(patch)) (v === null ? params.delete(k) : params.set(k, v));
    const qs = params.toString();
    if (qs === location.search.replace(/^\?/, "")) return;
    replaceQuery(router, `${path}${qs ? `?${qs}` : ""}${location.hash}`);
  };
  const typedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const close = (leaving = false) => {
    if (!leaving) sync({ find: null, lvl: null, pg: null }); // choosing a place navigates, and that address carries none of these
    setOpen(false);
    stop.current?.();
    setListening(false);
  };
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && (picking ? setPicking(false) : close());
    addEventListener("keydown", esc);
    addEventListener("resize", place);
    return () => {
      removeEventListener("keydown", esc);
      removeEventListener("resize", place);
    };
  }, [open, picking]);

  /* ---- breadcrumb: full, or Country > … > last when it does not fit ---- */
  const trailKey = `${ctx.country}/${ctx.trail.join("/")}`;
  // A layout effect declared before the measuring one, so the reset happens first and is never applied over a fresh measurement.
  useLayoutEffect(() => {
    setCrumbs("full");
  }, [trailKey, size.w, names, bc, open]);
  useLayoutEffect(() => {
    const row = crumbRow.current;
    if (crumbs === "full" && row && row.scrollWidth > row.clientWidth + 1 && ctx.trail.length > 1) setCrumbs("collapsed");
  }, [crumbs, trailKey, names, open]);

  /* ---- chips: measure once, then show as many as fit ---- */
  const chipKey = `${levels.join("|")}|${saved.length > 0}|${recent.length > 0}`;
  // Runs before the measuring effect below in the same commit, so a reset is never overwritten by a stale measurement.
  useLayoutEffect(() => {
    setChipFit(null);
    setMoreOpen(false);
  }, [chipKey, size.w, open, bc]);
  useLayoutEffect(() => {
    const row = chipRow.current;
    if (chipFit !== null || !row) return;
    const widths = [...row.querySelectorAll<HTMLElement>("[data-chip]")].map((el) => el.offsetWidth);
    const gap = 6,
      more = 36 + gap,
      avail = row.clientWidth;
    const total = widths.reduce((n, w, i) => n + w + (i ? gap : 0), 0);
    if (total <= avail) {
      setChipFit(widths.length);
      return;
    }
    let used = 0,
      k = 0;
    for (const w of widths) {
      const next = used + (k ? gap : 0) + w;
      if (next + more > avail) break;
      used = next;
      k++;
    }
    setChipFit(Math.max(1, k));
  }, [chipFit, chipKey, open]);

  const trailPaths = ctx.trail.map((_, i) => `/${[ctx.country, ...ctx.trail.slice(0, i + 1)].join("/")}`);
  const label = (p: string) => names.get(p) ?? prettify(p.split("/").pop() ?? "");
  const here = ctx.trail.length
    ? label(trailPaths.at(-1)!)
    : (COUNTRIES.find((c) => c.code === ctx.country)?.name ?? ctx.country);
  const browsingHome = bc === ctx.country;
  const hereSegs = [ctx.country, ...ctx.trail];

  /** How many leading path segments an entry shares with the current place: higher means more relevant. */
  const shared = (e: Entry) => {
    const s = segs(e.href);
    let n = 0;
    while (n < s.length && n < hereSegs.length && s[n] === hereSegs[n]) n++;
    return n;
  };
  const byRelevance = (list: Entry[]) => (browsingHome ? [...list].sort((a, b) => shared(b) - shared(a)) : list); // stable: ties keep data order

  const byHref = (h: string): Entry => entries.find((e) => e.href === h) ?? { kind: "Place", name: label(h), where: "", href: h };

  const full = useMemo(() => {
    const s = q.trim().toLowerCase();
    const chip = (e: Entry) => level === "all" || e.kind === level;
    if (level === "saved" || level === "recent") {
      // the reader's own shortlists, filtered by the search text
      const mine = level === "saved" ? saved.map((x) => ({ ...byHref(x.path), tag: x.label })) : recent.map(byHref);
      return s ? mine.filter((e) => e.name.toLowerCase().includes(s)) : mine;
    }
    if (kindMode || searchMode) {
      // Every place of the level, or every match, comes from the server one page at a time.
      const fresh =
        found !== null &&
        found.kind === (kindMode ? level : null) &&
        found.query === (searchMode ? q.trim() : "") &&
        found.page === page + 1;
      return fresh ? found.entries : [];
    }
    if (s) {
      const hit = inCountry.filter((e) => chip(e) && (e.name.toLowerCase().includes(s) || e.where.toLowerCase().includes(s)));
      return byRelevance([
        ...hit.filter((e) => e.name.toLowerCase().startsWith(s)),
        ...hit.filter((e) => !e.name.toLowerCase().startsWith(s)),
      ]);
    }
    if (level !== "all") return byRelevance(inCountry.filter((e) => e.kind === level)); // the whole level, relevant ones first
    // All levels: auto-narrow to the next level down; a leaf shows its siblings instead of an empty list.
    const depth = browsingHome ? hereSegs.length : 1;
    const children = inCountry.filter((e) => {
      const sg = segs(e.href);
      return sg.length === depth + 1 && hereSegs.slice(0, depth).every((x, i) => !browsingHome || sg[i] === x);
    });
    if (children.length || !browsingHome || hereSegs.length < 2) return children;
    const siblings = inCountry.filter((e) => {
      const sg = segs(e.href);
      return sg.length === hereSegs.length && hereSegs.slice(0, -1).every((x, i) => sg[i] === x);
    });
    return byRelevance(siblings);
  }, [inCountry, q, level, browsingHome, trailKey, found, page, kindMode, searchMode]);

  const serverList = (kindMode || searchMode) && level !== "saved" && level !== "recent";
  const total = serverList ? (found?.total ?? 0) : full.length;
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const safePage = Math.min(page, pages - 1);
  const list = serverList ? full : full.slice(safePage * PAGE, safePage * PAGE + PAGE);
  const loadingList = serverList && !full.length && (found === null || found.total > 0 || found.page !== page + 1 || found.query !== (searchMode ? q.trim() : ""));
  const showingSiblings = !q.trim() && level === "all" && browsingHome && ctx.trail.length === leafDepth - 1;
  const heading =
    level === "saved"
      ? t(copy.location.heading.saved)
      : level === "recent"
        ? t(copy.location.heading.recent)
        : q.trim()
          ? t(total === 1 ? copy.location.heading.resultsOne : copy.location.heading.resultsOther, { count: total })
          : level !== "all"
            ? t(copy.location.heading.level, { level: levelDefs.find((l) => l.code === level)?.label ?? level, count: total, country: countryDef.name })
            : showingSiblings
              ? t(copy.location.heading.others, { place: label(trailPaths.at(-2) ?? "") })
              : t(copy.location.heading.inside, { place: browsingHome ? here : countryDef.name });

  const go = (href: string, keepOpen: boolean) => {
    try {
      localStorage.setItem(RECENT, JSON.stringify([href, ...read(RECENT).filter((x) => x !== href)].slice(0, 6)));
    } catch {}
    nav.goPlace(placeFromHref(href));
    if (keepOpen && segs(href).length < leafDepth) {
      setBc(segs(href)[0]);
      reset();
    } // auto-narrow: stay open on the next level
    else close(true);
  };

  const speakAndMaybeOpen = (text: string) => {
    const s = text.toLowerCase().trim();
    const hit = inCountry.filter((e) => e.name.toLowerCase().includes(s));
    const best = hit.find((e) => e.name.toLowerCase() === s) ?? hit[0];
    const { mode } = getVoice();
    if (mode !== "off")
      speak(
        best
          ? t(hit.length === 1 ? copy.location.voice.resultsOne : copy.location.voice.resultsOther, {
              count: hit.length,
              name: best.name,
              kind: best.kind.toLowerCase(),
              where: best.where,
            })
          : t(copy.location.voice.noMatch, { query: text }),
      );
    if (mode === "handsfree" && best) go(best.href, false);
  };
  const voice = () => {
    if (listening) {
      stop.current?.();
      return;
    }
    setListening(true);
    stop.current = listen(
      (said, f) => {
        setQ(said);
        setActive(0);
        setPage(0);
        if (f) speakAndMaybeOpen(said);
      },
      () => setListening(false),
    );
    if (!stop.current) setListening(false);
  };
  const keyNav = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, list.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
    if (e.key === "Enter" && list[active]) go(list[active].href, true);
  };
  const turn = (p: number) => {
    if (serverList) sync({ pg: p > 0 ? String(p + 1) : null });
    setPage(p);
    setActive(0);
    listRef.current?.scrollTo({ top: 0 });
  };

  /* ---- resize from the top edge, right edge or corner; below the minimum on release hides the panel ---- */
  const startDrag = (axes: { w?: boolean; h?: boolean }) => (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    setDrag("ok");
    (e.currentTarget as HTMLElement).dataset.axes = JSON.stringify(axes);
  };
  const moveDrag = (e: React.PointerEvent) => {
    if (drag === "none") return;
    const axes = JSON.parse((e.currentTarget as HTMLElement).dataset.axes ?? "{}") as { w?: boolean; h?: boolean };
    const next = { w: axes.w ? e.clientX - pos.left : size.w, h: axes.h ? innerHeight - e.clientY - pos.bottom : size.h };
    setSize({ w: Math.max(160, Math.min(innerWidth - 16, next.w)), h: Math.max(120, Math.min(innerHeight - 16, next.h)) });
    setDrag(next.w < MIN.w || next.h < MIN.h ? "hide" : "ok");
  };
  const endDrag = () => {
    if (drag === "hide") {
      setDrag("none");
      setSize({ w: 560, h: 560 });
      close();
      return;
    }
    setDrag("none");
    try {
      localStorage.setItem(SIZE, JSON.stringify(size));
    } catch {}
  };

  /** The view chips: every level of the country, plus Saved and Recent when there are some. Chips that do not fit move into a small [...] menu. */
  const chipDefs: { id: string; label: string; icon?: typeof Bookmark }[] = [
    { id: "all", label: t(copy.location.chip.all) },
    ...levelDefs.map((l) => ({ id: l.code, label: l.label })),
    ...(saved.length ? [{ id: "saved", label: t(copy.location.chip.saved), icon: Bookmark }] : []),
    ...(recent.length ? [{ id: "recent", label: t(copy.location.chip.recent), icon: Clock }] : []),
  ];
  const pickChip = (id: string) => {
    setLevel(id);
    setPage(0);
    sync({ lvl: levelDefs.some((l) => l.code === id) ? id : null, pg: null });
    setActive(0);
    listRef.current?.scrollTo({ top: 0 });
  };
  const chipButton = (c: (typeof chipDefs)[number]) => (
    <button
      key={c.id}
      data-chip
      tabIndex={scrolled ? -1 : 0}
      aria-pressed={level === c.id}
      onClick={() => pickChip(c.id)}
      className={`flex max-w-[10rem] shrink-0 items-center gap-1 rounded-md border px-2.5 py-1 ${level === c.id ? "border-accent bg-accent-soft" : "border-line hover:border-muted"}`}
    >
      {c.icon && <c.icon size={11} className="shrink-0" />}
      <span className="min-w-0 truncate">{c.label}</span>
    </button>
  );
  const edge = "absolute z-10 hover:bg-accent/40";
  const countryHits = COUNTRIES.filter((c) => c.name.toLowerCase().includes(cq.toLowerCase()));
  /** Breadcrumb parts are plain text: no background or colour marks the current one. */
  const crumb = (p: string) => (
    <span key={p} className="flex shrink-0 items-center gap-1">
      <ChevronRight size={13} className="text-muted" />
      <button
        onClick={() => go(p, true)}
        className="max-w-[10rem] truncate rounded-md px-1 py-1 text-sm text-muted hover:text-ink"
      >
        {label(p)}
      </button>
    </span>
  );

  const panel = open && (
    <>
      <div className="fixed inset-0 z-[60]" onMouseDown={() => close()} />
      <div
        role="dialog"
        aria-label={t(copy.location.change)}
        style={{ left: pos.left, bottom: pos.bottom, width: size.w, height: size.h }}
        className={`@container floating fixed z-[61] flex flex-col overflow-hidden rounded-lg border border-line bg-surface ${drag === "hide" ? "opacity-60" : ""}`}
      >
        <div
          className={`${edge} inset-x-0 top-0 h-1.5 cursor-row-resize`}
          onPointerDown={startDrag({ h: true })}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          role="separator"
          aria-orientation="horizontal"
          aria-label={t(copy.location.resizeHeight)}
        />
        <div
          className={`${edge} inset-y-0 right-0 w-1.5 cursor-col-resize`}
          onPointerDown={startDrag({ w: true })}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          role="separator"
          aria-orientation="vertical"
          aria-label={t(copy.location.resizeWidth)}
        />
        <div
          className={`${edge} right-0 top-0 size-3 cursor-nesw-resize`}
          onPointerDown={startDrag({ w: true, h: true })}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          aria-hidden
        />

        {/* Header: small country switcher + breadcrumb */}
        <div className="relative flex shrink-0 items-center gap-1 border-b border-line px-3 py-2">
          <button
            onClick={() => {
              setPicking(!picking);
              setCq("");
            }}
            aria-expanded={picking}
            aria-haspopup="listbox"
            aria-label={t(copy.location.countryButton, { country: countryDef.name })}
            className="flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-line bg-accent-soft/60 px-2 text-xs font-medium hover:border-muted"
          >
            <Flag code={countryDef.code} size={16} />
            {countryDef.name}
            <Caret className="text-muted" />
          </button>
          <nav
            ref={crumbRow}
            aria-label={t(copy.location.youAreHere)}
            className={`flex min-w-0 flex-1 items-center gap-0.5 ${crumbs === "expanded" ? "flex-wrap" : "overflow-hidden whitespace-nowrap"}`}
          >
            {browsingHome ? (
              crumbs === "collapsed" && ctx.trail.length > 1 ? (
                <>
                  <span className="flex shrink-0 items-center gap-1">
                    <ChevronRight size={13} className="text-muted" />
                    <button
                      onClick={() => setCrumbs("expanded")}
                      title={ctx.trail.map((_, i) => label(trailPaths[i])).join(" › ")}
                      aria-label={t(copy.location.showPath)}
                      className="rounded-md px-1.5 py-1 text-sm text-muted hover:bg-accent-soft hover:text-ink"
                    >
                      …
                    </button>
                  </span>
                  {crumb(trailPaths.at(-1)!)}
                </>
              ) : (
                trailPaths.map((p) => crumb(p))
              )
            ) : (
              <button
                onClick={() => go(`/${bc}`, true)}
                className="ml-1 rounded-md px-1.5 py-1 text-sm text-accent hover:bg-accent-soft"
              >
                {t(copy.location.open, { country: countryDef.name })}
              </button>
            )}
          </nav>
          <button
            onClick={() => close()}
            aria-label={t(copy.location.close)}
            className="grid size-8 shrink-0 place-items-center rounded-md text-muted hover:bg-accent-soft"
          >
            <X size={15} />
          </button>
          {picking && (
            <div className="floating absolute left-3 top-full z-20 mt-1 w-72 max-w-[calc(100%-1.5rem)] rounded-lg border border-line bg-surface p-2">
              <TextField
                label={t(copy.location.searchCountries)}
                value={cq}
                onChange={setCq}
                placeholder={t(copy.location.searchCountries)}
                icon={<Search size={15} />}
                autoFocus
                size="sm"
                className="mb-1"
              />
              <ul role="listbox" aria-label="Countries" className="max-h-44 overflow-y-auto">
                {countryHits.map((c) => (
                  <li key={c.code} role="option" aria-selected={c.code === bc}>
                    <button
                      onClick={() => {
                        setBc(c.code);
                        setPicking(false);
                        reset();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm hover:bg-accent-soft"
                    >
                      <Flag code={c.code} size={20} />
                      <span className="min-w-0 flex-1 truncate">{c.name}</span>
                      <span className="shrink-0 font-mono text-[11px] text-muted">
                        {c.iso}
                      </span>
                      {c.code === bc && <Check size={14} className="shrink-0 text-accent" />}
                    </button>
                  </li>
                ))}
                {!countryHits.length && <li className="px-3 py-3 text-sm text-muted">No country matches.</li>}
              </ul>
            </div>
          )}
        </div>

        {/* Search stays; the level chips collapse while the list is scrolled to keep the header short */}
        <div className="shrink-0 border-b border-line px-3 py-2.5">
          <div className="flex items-center gap-2">
            <TextField
              className="flex-1"
              label={t(copy.location.searchPlaces, { country: countryDef.name })}
              value={q}
              onChange={(v) => {
                setQ(v);
                setActive(0);
                setPage(0);
                if (typedTimer.current) clearTimeout(typedTimer.current);
                typedTimer.current = setTimeout(() => sync({ find: v.trim().length >= 2 ? v.trim() : null, pg: null }), 250);
              }}
              onKeyDown={keyNav}
              placeholder={listening ? t(copy.location.listening) : t(copy.location.placeholder, { levels: levels.join(", ").toLowerCase(), country: countryDef.name })}
              icon={<Search size={15} />}
              autoFocus
            />
            <button
              onClick={useDevice}
              disabled={locating === "busy"}
              aria-label={locating === "failed" ? t(copy.location.locationFailed) : t(copy.location.myLocation)}
              title={locating === "busy" ? t(copy.location.locating) : locating === "failed" ? t(copy.location.locationFailed) : t(copy.location.myLocation)}
              className={`grid size-10 place-items-center rounded-md border border-line hover:bg-accent-soft disabled:opacity-60 ${locating === "failed" ? "text-muted" : ""}`}
            >
              {locating === "busy" ? <Loader2 size={16} className="animate-spin" /> : <Crosshair size={16} />}
            </button>
            <button
              onClick={voice}
              aria-label={listening ? t(copy.location.stopListening) : t(copy.location.byVoice)}
              aria-pressed={listening}
              className={`grid size-10 place-items-center rounded-md border ${listening ? "border-accent bg-accent text-paper" : "border-line hover:bg-accent-soft"}`}
            >
              <Mic size={16} />
            </button>
          </div>
          {chipDefs.length > 1 && (
            <div
              className={`relative grid transition-all duration-200 ${scrolled ? "mt-0 grid-rows-[0fr] opacity-0" : "mt-2.5 grid-rows-[1fr] opacity-100"}`}
              aria-hidden={scrolled}
            >
              <div className="overflow-hidden">
                <div
                  ref={chipRow}
                  className={`flex gap-1.5 whitespace-nowrap text-xs ${chipFit === null ? "invisible" : ""}`}
                  role="group"
                  aria-label={t(copy.location.viewsOf, { country: countryDef.name })}
                >
                  {(chipFit === null ? chipDefs : chipDefs.slice(0, chipFit)).map((c) => chipButton(c))}
                  {chipFit !== null && chipFit < chipDefs.length && (
                    <button
                      onClick={() => setMoreOpen(!moreOpen)}
                      aria-expanded={moreOpen}
                      aria-label={t(copy.location.moreViews, { count: chipDefs.length - (chipFit ?? 0) })}
                      tabIndex={scrolled ? -1 : 0}
                      className={`grid h-[26px] w-9 shrink-0 place-items-center rounded-md border ${chipDefs.slice(chipFit ?? 0).some((c) => c.id === level) ? "border-accent bg-accent-soft" : "border-line hover:border-muted"}`}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  )}
                </div>
              </div>
              {moreOpen && chipFit !== null && (
                <div className="floating absolute right-0 top-full z-30 mt-1 w-40 rounded-lg border border-line bg-surface p-1">
                  {chipDefs.slice(chipFit ?? 0).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        pickChip(c.id);
                        setMoreOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-accent-soft ${level === c.id ? "font-medium" : ""}`}
                    >
                      {c.icon && <c.icon size={13} className="text-muted" />}
                      {c.label}
                      {level === c.id && <Check size={13} className="ml-auto text-accent" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div
          ref={listRef}
          onScroll={(e) => {
            const t = (e.target as HTMLElement).scrollTop;
            if (t > 24 && !scrolled) setScrolled(true);
            else if (t <= 0 && scrolled) setScrolled(false);
          }}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2"
        >
          {!q.trim() && level === "all" && safePage === 0 && (saved.length > 0 || recent.length > 0) && (
            <div className="mb-1 space-y-2 px-2 pb-2">
              {saved.length > 0 && (
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted">
                    <Bookmark size={12} />
                    Saved
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {saved.map((s) => (
                      <button
                        key={s.path}
                        onClick={() => go(s.path, false)}
                        className="rounded-md border border-line px-2.5 py-1 text-sm hover:border-muted"
                      >
                        {s.label && <b className="mr-1.5 text-xs text-accent">{s.label}</b>}
                        {byHref(s.path).name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {recent.length > 0 && (
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted">
                    <Clock size={12} />
                    Recent
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recent.map((h) => (
                      <button
                        key={h}
                        onClick={() => go(h, false)}
                        className="rounded-md border border-line px-2.5 py-1 text-sm hover:border-muted"
                      >
                        {byHref(h).name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="px-2 pb-1 pt-1 font-mono text-[10px] uppercase tracking-widest text-muted">{heading}</div>
          <ul role="listbox" aria-label={t(copy.location.places)}>
            {/* The whole country is always one tap away on All levels, wherever you are inside it. */}
            {level === "all" && !q.trim() && (
              <li role="option" aria-selected={browsingHome && ctx.trail.length === 0}>
                <button
                  onClick={() => go(`/${bc}`, true)}
                  className={`mb-1 flex w-full items-center gap-3 rounded-md border border-line px-3 py-2 text-left text-sm hover:bg-accent-soft ${browsingHome && ctx.trail.length === 0 ? "bg-accent-soft/60" : ""}`}
                >
                  <Flag code={bc} size={22} />
                  <span className="min-w-0 truncate font-medium">{t(copy.location.wholeCountry)}</span>
                  <span className="shrink-0 text-muted">·</span>
                  <span className="min-w-0 truncate text-muted">{countryDef.name}</span>
                  {browsingHome && ctx.trail.length === 0 && <Check size={13} className="ml-auto shrink-0 text-accent" />}
                </button>
              </li>
            )}
            {list.map((e, i) => {
              const current = browsingHome && e.href.split("?")[0] === `/${hereSegs.join("/")}`;
              return (
                <li key={e.href} role="option" aria-selected={i === active}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(e.href, true)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm ${i === active ? "bg-accent-soft" : ""} ${current ? "bg-accent-soft/60" : ""}`}
                  >
                    <Avatar href={e.href} />
                    <span className="min-w-0 truncate font-medium">{e.name}</span>
                    {e.tag && (
                      <span className="shrink-0 rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                        {e.tag}
                      </span>
                    )}
                    {current && <Check size={13} className="shrink-0 text-accent" />}
                    <span className="ml-auto hidden min-w-0 shrink truncate text-xs text-muted @md:inline">
                      {e.kind}
                      {e.where ? ` · ${e.where}` : ""}
                    </span>
                  </button>
                </li>
              );
            })}
            {!list.length && loadingList && <li className="truncate px-3 py-6 text-sm text-muted">{t(copy.location.loading)}</li>}
            {!list.length && !loadingList && entries.length > 0 && (
              <li className="px-3 py-6 text-sm text-muted">
                {q ? t(copy.location.noMatch, { query: q }) : t(copy.location.noFiner, { place: browsingHome ? here : countryDef.name })}
              </li>
            )}
            {!entries.length && <li className="px-3 py-6 text-sm text-muted">{t(copy.location.loading)}</li>}
          </ul>
        </div>

        {/* Prev / Next: paging is cheaper than loading or scrolling thousands of rows. One row, never wrapped. */}
        <div className="flex shrink-0 items-center justify-end gap-2 whitespace-nowrap border-t border-line px-3 py-2 text-xs text-muted">
          {drag === "hide" && <span className="mr-auto">Release to hide</span>}
          {full.length > 0 && (
            <span className="shrink-0 font-mono">
              {t(copy.location.range, { from: safePage * PAGE + 1, to: Math.min(total, safePage * PAGE + PAGE), total })}
            </span>
          )}
          <button
            onClick={() => turn(safePage - 1)}
            disabled={safePage === 0}
            aria-label={t(copy.location.previous)}
            className="grid size-7 shrink-0 place-items-center rounded-md border border-line hover:bg-accent-soft disabled:opacity-40"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => turn(safePage + 1)}
            disabled={safePage >= pages - 1}
            aria-label={t(copy.location.next)}
            className="grid size-7 shrink-0 place-items-center rounded-md border border-line hover:bg-accent-soft disabled:opacity-40"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </>
  );

  if (!ctx.ready)
    return (
      <div className={`@container min-w-0 flex-1 ${compact ? "flex justify-center" : ""}`}>
        <div className={`h-9 rounded-md bg-line/30 ${compact ? "w-9" : "w-full"}`} aria-hidden />
      </div>
    ); // waits for the saved place instead of flashing a default one
  return (
    <div className={`@container min-w-0 flex-1 ${compact ? "flex justify-center" : ""}`}>
      <button
        ref={button}
        onClick={() => (open ? close() : show())}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={ctx.trail.length > 1 ? t(copy.location.buttonIn, { here, parents: trailPaths.map(label).slice(0, -1).join(", ") }) : t(copy.location.button, { here })}
        title={`${COUNTRIES.find((c) => c.code === ctx.country)?.name ?? ""} › ${ctx.trail.map((_, i) => label(trailPaths[i])).join(" › ")}`}
        className={`flex h-9 items-center rounded-md border border-line bg-accent-soft/60 text-sm text-ink transition hover:border-muted ${compact ? "w-9 justify-center" : "w-full min-w-0 gap-2 px-2"}`}
      >
        {compact ? (
          <Flag code={ctx.country} size={18} />
        ) : (
          <>
            <Flag code={ctx.country} size={16} />
            <span className="flex min-w-0 flex-1 items-center gap-1 text-left">
              <span className="shrink-0 font-mono text-xs font-medium">
                {COUNTRIES.find((c) => c.code === ctx.country)?.iso ?? ctx.country.toUpperCase()}
              </span>
              {ctx.trail.length > 1 && (
                <>
                  <ChevronRight size={12} className="shrink-0 text-muted" />
                  <span className="shrink-0 text-muted" aria-hidden>
                    …
                  </span>
                </>
              )}
              {ctx.trail.length > 0 && (
                <>
                  <ChevronRight size={12} className="shrink-0 text-muted" />
                  <span className="min-w-0 truncate">{here}</span>
                </>
              )}
            </span>
            {/* The level of the place, when the sidebar is wide enough to show it. */}
            <span className="hidden shrink-0 rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted @[230px]:inline">
              {ctx.trail.length === 0
                ? t(copy.location.levelCountry)
                : ((COUNTRIES.find((c) => c.code === ctx.country)?.levels)?.[
                    ctx.trail.length - 1
                  ] ?? t(copy.location.levelPlace))}
            </span>
            <Caret className="shrink-0 text-muted" />
          </>
        )}
      </button>
      {typeof document !== "undefined" && panel && createPortal(panel, document.body)}
    </div>
  );
}
