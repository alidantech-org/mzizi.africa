"use client";
/** Personal home: your area, what you use most, saved places with labels, and a place finder. */
import { ArrowRight, Crosshair, Pencil, Plus, Search, X } from "lucide-react";
import Link from "#demo/_components/navigation/demo-link";
import { useEffect, useMemo, useState } from "react";
import { countyDemo, indicators } from "#demo/_data/demo";
import population from "#demo/_data/generated/population.json";
import { counties, otherCountry, resolvePlace, searchEntries } from "#demo/_data/places";
import { compact } from "#demo/_lib/formatting/format";
import { demoSegments } from "#demo/_lib/navigation/base";
import { available, build, isView, prettify, VIEWS, type Place } from "#demo/_lib/navigation/route";
import { homePath, readHome, readSaved, topViews, writeSaved, type Saved } from "#demo/_lib/preferences/saved";
import { TextField } from "#demo/_components/ui/controls";
import { Onboarding } from "#demo/_components/preferences/onboarding";

const nameOf = (p: Place) => {
  const r = resolvePlace(p.country, p.trail);
  return r.ok ? (r.trail.at(-1)?.name ?? r.countryName) : prettify(p.trail.at(-1) ?? p.country);
};
const trailOf = (p: Place) => {
  const r = resolvePlace(p.country, p.trail);
  return r.ok ? [r.countryName, ...r.trail.map((t) => t.name)].join(" › ") : "";
};
const placeOfPath = (path: string): Place => {
  const s = demoSegments(path);
  return { country: s[0], trail: s.slice(1) };
};

export function HomeStart() {
  const [home, setHome] = useState<Place | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [used, setUsed] = useState<string[]>([]);
  useEffect(() => {
    const h = readHome();
    setHome(h);
    setUsed(topViews(4));
    if (!h) {
      try {
        if (!localStorage.getItem("mzizi-demo-onboarded")) setOpen(true);
      } catch {}
    }
  }, []);
  const finish = () => {
    try {
      localStorage.setItem("mzizi-demo-onboarded", "1");
    } catch {}
    setOpen(false);
  };

  const card = (() => {
    if (home === undefined) return <div className="h-52 animate-pulse rounded-lg border border-line bg-surface" />;
    if (home === null)
      return (
        <div className="rounded-lg border border-line bg-surface p-6">
          <h2 className="font-display text-2xl">Set your place once</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            We can guess your country, find your county from your GPS, and remember your language and look. Then everything here
            follows your area.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-paper"
          >
            <Crosshair size={15} />
            Set up my place
          </button>
        </div>
      );
    const r = resolvePlace(home.country, home.trail);
    const county = home.country === "ke" ? counties.find((c) => c.slug === home.trail[0]) : undefined;
    const demo = county ? countyDemo.find((c) => c.slug === county.slug) : undefined;
    const oc = otherCountry(home.country);
    const pop = (population as Record<string, { year: number; value: number }[]>)[
      home.country === "ke" ? "KEN" : (oc?.iso ?? "")
    ]?.at(-1);
    const tiles: [string, string][] =
      demo && county
        ? [
            ["Constituencies", String(county.constituencies.length)],
            ["Wards", String(county.constituencies.reduce((n, k) => n + k.wards.length, 0))],
            ["Population (demo)", compact(demo.population)],
            [indicators[0].label + " (demo)", `${demo.values.literacy}%`],
          ]
        : pop
          ? [
              ["Population " + pop.year, compact(pop.value)],
              ["Level", r.ok ? r.level : "Country"],
            ]
          : [];
    const links = (["leaders", "law", "finance", "compare"] as const).filter((v) => available(v, home));
    return (
      <div className="rounded-lg border border-line bg-surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent">Your area</div>
            <h2 className="mt-1 font-display text-3xl">{nameOf(home)}</h2>
            <p className="mt-1 text-sm text-muted">{trailOf(home)}</p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs hover:bg-accent-soft"
          >
            <Pencil size={12} />
            Change
          </button>
        </div>
        {tiles.length > 0 && (
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tiles.map(([k, v]) => (
              <div key={k} className="rounded-md border border-line px-3 py-2.5">
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="font-display text-2xl">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            href={homePath(home)}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-paper"
          >
            Explore {nameOf(home)} <ArrowRight size={14} />
          </Link>
          {links.map((v) => (
            <Link
              key={v}
              href={build(home, { view: v })}
              className="rounded-md border border-line px-3 py-2 text-sm hover:bg-accent-soft"
            >
              {VIEWS[v].label}
            </Link>
          ))}
        </div>
        {used.filter(isView).length > 0 && (
          <p className="mt-4 text-xs text-muted">
            You use most:{" "}
            {used.filter(isView).map((v, i) => (
              <span key={v}>
                {i > 0 && ", "}
                <Link href={build(home, { view: v })} className="text-accent hover:underline">
                  {VIEWS[v].label}
                </Link>
              </span>
            ))}
          </p>
        )}
      </div>
    );
  })();

  return (
    <>
      {card}
      <Onboarding
        open={open}
        onClose={finish}
        onDone={(h) => {
          setHome(h);
          finish();
        }}
      />
    </>
  );
}

export function PlaceFinder({ onPick }: { onPick?: (path: string, name: string) => void }) {
  const [entries, setEntries] = useState<ReturnType<typeof searchEntries>>([]);
  const [q, setQ] = useState("");
  useEffect(() => setEntries(searchEntries()), []);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const hit = entries.filter((e) => e.name.toLowerCase().includes(s));
    return [
      ...hit.filter((e) => e.name.toLowerCase().startsWith(s)),
      ...hit.filter((e) => !e.name.toLowerCase().startsWith(s)),
    ].slice(0, 8);
  }, [q, entries]);
  return (
    <div className="relative max-w-xl">
      <TextField
        label="Find a place"
        value={q}
        onChange={setQ}
        placeholder="Search a country, county, constituency or ward"
        icon={<Search size={16} />}
        size="lg"
      />
      {list.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-lg border border-line bg-surface p-1">
          {list.map((e) => (
            <li key={e.href}>
              {onPick ? (
                <button
                  onClick={() => {
                    onPick(e.href, e.name);
                    setQ("");
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-accent-soft"
                >
                  <span className="w-20 font-mono text-[10px] uppercase tracking-wider text-accent">{e.kind}</span>
                  {e.name}
                  <span className="ml-auto text-xs text-muted">{e.where}</span>
                </button>
              ) : (
                <Link href={e.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent-soft">
                  <span className="w-20 font-mono text-[10px] uppercase tracking-wider text-accent">{e.kind}</span>
                  {e.name}
                  <span className="ml-auto text-xs text-muted">{e.where}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Saved places, each with a label. With `manage`, labels can be edited and places added or removed. */
export function SavedPlaces({ manage = false }: { manage?: boolean }) {
  const [saved, setSaved] = useState<Saved[]>([]);
  const [label, setLabel] = useState("");
  useEffect(() => setSaved(readSaved()), []);
  const commit = (next: Saved[]) => {
    setSaved(next);
    writeSaved(next);
  };
  const add = (path: string) => commit([...saved.filter((s) => s.path !== path), { path, label: label.trim() }]);
  return (
    <div className="space-y-4">
      {manage && (
        <div className="flex flex-wrap items-start gap-3">
          <div className="w-48">
            <div className="mb-1 text-xs text-muted">Label (optional)</div>
            <TextField label="Label" value={label} onChange={setLabel} placeholder="Work, Family…" />
          </div>
          <div className="flex-1 pt-5">
            <PlaceFinder
              onPick={(p) => {
                add(p);
                setLabel("");
              }}
            />
          </div>
        </div>
      )}
      {!saved.length ? (
        <p className="rounded-lg border border-dashed border-muted p-6 text-sm text-muted">
          No saved places yet.{manage ? " Search above to add one." : ""}
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((s) => {
            const place = placeOfPath(s.path);
            return (
              <li key={s.path} className="rounded-lg border border-line bg-surface p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {s.label && (
                      <div className="mb-1 inline-block rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                        {s.label}
                      </div>
                    )}
                    <div className="truncate font-display text-xl">{nameOf(place)}</div>
                    <div className="truncate text-xs text-muted">{trailOf(place)}</div>
                  </div>
                  {manage && (
                    <button
                      onClick={() => commit(saved.filter((x) => x.path !== s.path))}
                      aria-label={`Remove ${nameOf(place)}`}
                      className="grid size-6 shrink-0 place-items-center rounded-md text-muted hover:bg-accent-soft"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                {manage && (
                  <div className="mt-2">
                    <div className="mb-1 text-xs text-muted">Label</div>
                    <TextField
                      label="Label"
                      size="sm"
                      value={s.label}
                      onChange={(v) => commit(saved.map((x) => (x.path === s.path ? { ...x, label: v } : x)))}
                    />
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                  <Link href={homePath(place)} className="rounded-md bg-accent px-2 py-1 text-paper">
                    Explore
                  </Link>
                  {(["leaders", "law", "compare"] as const)
                    .filter((v) => available(v, place))
                    .map((v) => (
                      <Link
                        key={v}
                        href={build(place, { view: v })}
                        className="rounded-md border border-line px-2 py-1 hover:bg-accent-soft"
                      >
                        {VIEWS[v].label}
                      </Link>
                    ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
