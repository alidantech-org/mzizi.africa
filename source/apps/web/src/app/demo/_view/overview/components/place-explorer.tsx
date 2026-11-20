"use client";
/**
 * One county drawn on a plain surface, then drilled into constituencies and wards. Click a part to open it.
 * County outlines are real (geoBoundaries). Constituency and ward shapes are schematic until real boundaries load.
 */
import { ArrowUpRight, ChevronRight, MapPinned } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { County } from "#demo/_data/places";
import { PagedList } from "#demo/_components/ui/paged-list";
import { bounds, partition, pathOf, type Point } from "#demo/_lib/geography/partition";
import { useNav } from "#demo/_lib/navigation/use-ctx";

type Geo = { width: number; height: number; d: string; rings: Point[][] };

export function PlaceExplorer({
  county,
  geo,
  constituencySlug,
  wardSlug,
}: {
  county: County;
  geo: Geo;
  constituencySlug?: string;
  wardSlug?: string;
}) {
  const nav = useNav();
  const [hover, setHover] = useState<string | null>(null);
  const constituency = county.constituencies.find((c) => c.slug === constituencySlug) ?? null;
  const ward = constituency?.wards.find((w) => w.slug === wardSlug) ?? null;

  const go = (c?: string, w?: string) =>
    nav.goPlace({ country: "ke", trail: [county.slug, ...(c ? [c] : []), ...(c && w ? [w] : [])] });

  const cells = useMemo(() => partition(geo.rings, county.constituencies.length, county.code), [geo, county]);
  const cell = constituency ? cells[county.constituencies.indexOf(constituency)] : null;
  const wardCells = useMemo(
    () => (cell && constituency ? partition([cell.polygon], constituency.wards.length, constituency.code) : []),
    [cell, constituency],
  );

  const view = cell ? bounds(cell.polygon) : { x0: 0, y0: 0, x1: geo.width, y1: geo.height };
  const pad = cell ? 14 : 6;
  const viewBox = `${view.x0 - pad} ${view.y0 - pad} ${view.x1 - view.x0 + pad * 2} ${view.y1 - view.y0 + pad * 2}`;
  const scale = (view.x1 - view.x0 + pad * 2) / geo.width;

  const items = constituency
    ? constituency.wards.map((w, i) => ({
        key: w.slug,
        name: w.name,
        poly: wardCells[i]?.polygon ?? [],
        c: wardCells[i]?.centroid ?? ([0, 0] as Point),
      }))
    : county.constituencies.map((k, i) => ({ key: k.slug, name: k.name, poly: cells[i].polygon, c: cells[i].centroid }));
  const selectedKey = constituency ? ward?.slug : null;
  const show = hover ?? selectedKey ?? null;
  const shownName = items.find((i) => i.key === show)?.name;
  const fontSize = Math.max(7, Math.min(15, ((cell ? 26 : 34) / Math.sqrt(items.length / 6 + 1)) * scale * 1.1));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      <div className="rounded-lg border border-line bg-surface p-5">
        <nav aria-label="Place path" className="mb-3 flex flex-wrap items-center gap-1 text-sm text-muted">
          <button className="hover:text-ink" onClick={() => nav.goPlace({ country: "ke", trail: [] })}>
            Kenya
          </button>
          <ChevronRight size={14} />
          <button className={`${!constituency ? "font-medium text-ink" : "hover:text-ink"}`} onClick={() => go()}>
            {county.name}
          </button>
          {constituency && (
            <>
              <ChevronRight size={14} />
              <button className={`${!ward ? "font-medium text-ink" : "hover:text-ink"}`} onClick={() => go(constituency.slug)}>
                {constituency.name}
              </button>
            </>
          )}
          {ward && (
            <>
              <ChevronRight size={14} />
              <span className="font-medium text-ink">{ward.name}</span>
            </>
          )}
        </nav>
        <div className="relative overflow-hidden rounded-lg bg-paper">
          <AnimatePresence mode="wait">
            <motion.svg
              key={constituency?.slug ?? "county"}
              viewBox={viewBox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.28 }}
              className="mx-auto block max-h-[620px] w-full"
              role="group"
              aria-label={constituency ? `Wards of ${constituency.name}` : `Constituencies of ${county.name}`}
            >
              <defs>
                <clipPath id="clip-shape">{cell ? <path d={pathOf(cell.polygon)} /> : <path d={geo.d} />}</clipPath>
              </defs>
              <g clipPath="url(#clip-shape)">
                {items.map((it, i) => {
                  const active = it.key === selectedKey;
                  const hot = it.key === hover;
                  return (
                    <path
                      key={it.key}
                      d={pathOf(it.poly)}
                      role="button"
                      tabIndex={0}
                      aria-label={it.name}
                      onMouseEnter={() => setHover(it.key)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(it.key)}
                      onBlur={() => setHover(null)}
                      onClick={() => (constituency ? go(constituency.slug, it.key) : go(it.key))}
                      onKeyDown={(e) =>
                        (e.key === "Enter" || e.key === " ") && (constituency ? go(constituency.slug, it.key) : go(it.key))
                      }
                      className="cursor-pointer outline-none transition-[fill] duration-200"
                      fill={active ? "var(--accent)" : hot ? "var(--accent-soft)" : `var(--scale-${(i * 7) % 3})`}
                      stroke="var(--surface)"
                      strokeWidth={2.2 * scale}
                      strokeLinejoin="round"
                    />
                  );
                })}
              </g>
              <path
                d={cell ? pathOf(cell.polygon) : geo.d}
                fill="none"
                stroke="var(--ink)"
                strokeOpacity={0.55}
                strokeWidth={2.4 * scale}
                strokeLinejoin="round"
                pointerEvents="none"
              />
              {items.length <= 40 &&
                items.map((it) => (
                  <text
                    key={it.key}
                    x={it.c[0]}
                    y={it.c[1]}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={fontSize}
                    pointerEvents="none"
                    fill={it.key === selectedKey ? "var(--paper)" : "var(--ink)"}
                    style={{ fontWeight: 500 }}
                  >
                    {it.name.length > 14 ? it.name.slice(0, 13) + "…" : it.name}
                  </text>
                ))}
            </motion.svg>
          </AnimatePresence>
          {shownName && (
            <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs text-paper">
              {shownName}
            </div>
          )}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          {constituency
            ? `Schematic wards of ${constituency.name}: real names, positions not to scale.`
            : `County outline is a real boundary. Constituency positions are schematic until real boundaries are loaded.`}{" "}
          Click a part to open it.
        </p>
      </div>

      <aside className="flex flex-col gap-4">
        <div className="rounded-lg bg-surface border border-line p-6 text-side-ink">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest opacity-60">
            <MapPinned size={14} />
            {ward ? "Ward" : constituency ? "Constituency" : "County"}
          </div>
          <h2 className="mt-2 font-display text-4xl tracking-tight">{ward?.name ?? constituency?.name ?? county.name}</h2>
          <p className="mt-2 text-sm opacity-75">
            Kenya / {county.name}
            {constituency ? ` / ${constituency.name}` : ""}
            {ward ? ` / ${ward.name}` : ""}
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            {!constituency && (
              <>
                <Stat k="Constituencies" v={county.constituencies.length} />
                <Stat k="Wards" v={county.constituencies.reduce((n, c) => n + c.wards.length, 0)} />
              </>
            )}
            {constituency && !ward && (
              <>
                <Stat k="Wards" v={constituency.wards.length} />
                <Stat k="Elects" v="1 MP" />
              </>
            )}
            {ward && (
              <>
                <Stat k="Elects" v="1 MCA" />
                <Stat k="Level" v="Ward" />
              </>
            )}
          </dl>
          <p className="mt-4 break-all font-mono text-[11px] opacity-50">{ward?.code ?? constituency?.code ?? county.code}</p>
          <div className="mt-5 flex gap-2">
            {constituency && (
              <button
                onClick={() => (ward ? go(constituency.slug) : go())}
                className="rounded-full bg-side-ink px-4 py-2 text-sm font-medium text-side"
              >
                Back up one level
              </button>
            )}
          </div>
        </div>
        <PagedList
          title={constituency ? `${constituency.wards.length} wards` : `${county.constituencies.length} constituencies`}
          unit={constituency ? "wards" : "constituencies"}
          items={items}
          pageSize={8}
          selected={items.findIndex((i) => i.key === selectedKey)}
          resetKey={constituency?.slug ?? "county"}
          render={(it) => (
            <button
              key={it.key}
              onMouseEnter={() => setHover(it.key)}
              onMouseLeave={() => setHover(null)}
              onClick={() => (constituency ? go(constituency.slug, it.key) : go(it.key))}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${it.key === selectedKey ? "bg-accent text-paper" : it.key === hover ? "bg-accent-soft" : "hover:bg-accent-soft"}`}
            >
              {it.name}
              <ArrowUpRight size={14} className="opacity-40" />
            </button>
          )}
        />
      </aside>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="rounded-lg bg-paper px-4 py-3">
      <dt className="text-xs opacity-60">{k}</dt>
      <dd className="mt-0.5 font-display text-2xl">{v}</dd>
    </div>
  );
}
