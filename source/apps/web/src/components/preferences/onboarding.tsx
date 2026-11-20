"use client";
/** First-visit setup. Detects the country and area, lets you change either, then asks language and look. */
import { Check, ChevronDown, Crosshair, Loader2, MapPin, Palette, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { languagesForArea } from "#demo/_data/languages";
import { counties, otherCountries, searchEntries } from "#demo/_data/places";
import { countyAt, fromCountyMap, guessCountry, nearbyCounties, toCountyMap } from "#/lib/geography/geo";
import { bounds, inside, partition, type Cell, type Point } from "#/lib/geography/partition";
import { demoSegments } from "#/lib/navigation/base";
import { COUNTRIES, type Place } from "#/lib/navigation/route";
import { setCountry as setThemeCountry } from "#/lib/preferences/prefs";
import { writeHome, writeLang } from "#/lib/preferences/saved";
import { Flag } from "#/components/brand/flag";
import { OsmMap } from "#/components/visualization/osm-map";
import { ChipRow, type Chip } from "#/components/ui/chip-row";
import { buttonClass, DialogShell } from "#/components/ui/shells";
import { ThemeSwitcher } from "#/components/preferences/theme-switcher";

type Fix = { lat: number; lon: number; from: "connection" | "device" | "map" | "search" };
const HOME: Record<string, { lat: number; lon: number; z: number }> = {
  ke: { lat: 0.2, lon: 37.9, z: 5 },
  za: { lat: -29, lon: 24.5, z: 4 },
  ng: { lat: 9.1, lon: 8.7, z: 5 },
  tz: { lat: -6.3, lon: 34.9, z: 5 },
};
const STEPS = ["Your place", "Language and look"];

/** Shows its content with a short slide and fade, so each new choice appears instead of jumping in. */
function Reveal({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div
      className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
      style={{ gridTemplateRows: show ? "1fr" : "0fr", opacity: show ? 1 : 0 }}
      aria-hidden={!show}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

/** A labelled part of the dialog. The label sits on top. */
const Part = ({ label, children }: { label: ReactNode; children: ReactNode }) => (
  <div className="py-2.5">
    <div className="mb-1.5 text-xs font-medium text-muted">{label}</div>
    {children}
  </div>
);

/** Country picker with search, like the location switcher: the detected country is already chosen. */
function CountrySelect({ items, value, onPick }: { items: Chip[]; value: string; onPick: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && (e.stopPropagation(), setOpen(false));
    addEventListener("mousedown", away);
    addEventListener("keydown", esc, true);
    return () => {
      removeEventListener("mousedown", away);
      removeEventListener("keydown", esc, true);
    };
  }, [open]);
  const cur = items.find((i) => i.id === value);
  const list = items.filter((i) => i.label.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setQ("");
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-9 w-full items-center gap-2.5 rounded-md border border-line px-3 text-sm hover:border-muted"
      >
        {cur?.icon}
        <span className="font-medium">{cur?.label}</span>
        <ChevronDown size={14} className={`ml-auto text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="floating absolute left-0 top-full z-30 mt-1.5 w-full rounded-lg border border-line bg-surface p-1.5">
          <div className="flex items-center gap-2 border-b border-line px-2 pb-1.5">
            <Search size={13} className="text-muted" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search countries"
              aria-label="Search countries"
              className="h-7 w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </div>
          <ul role="listbox" aria-label="Country" className="mt-1">
            {list.map((i) => (
              <li key={i.id} role="option" aria-selected={i.id === value}>
                <button
                  type="button"
                  onClick={() => {
                    onPick(i.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-accent-soft ${i.id === value ? "bg-accent-soft font-medium" : ""}`}
                >
                  {i.icon}
                  {i.label}
                  {i.id === value && <Check size={13} className="ml-auto text-accent" />}
                </button>
              </li>
            ))}
            {!list.length && <li className="px-2.5 py-2 text-sm text-muted">Nothing matches.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Search for a place by name; suggestions drop down and choosing one pins it on the map. */
function PlaceSearch({ onPick }: { onPick: (href: string) => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<ReturnType<typeof searchEntries>>([]);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => setEntries(searchEntries().filter((e) => e.kind !== "Country")), []);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    addEventListener("mousedown", away);
    return () => removeEventListener("mousedown", away);
  }, [open]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const hit = entries.filter((e) => e.name.toLowerCase().includes(s));
    return [
      ...hit.filter((e) => e.name.toLowerCase().startsWith(s)),
      ...hit.filter((e) => !e.name.toLowerCase().startsWith(s)),
    ].slice(0, 6);
  }, [q, entries]);
  return (
    <div ref={box} className="relative min-w-0 flex-1">
      <div className="flex h-9 items-center gap-2 rounded-md border border-line px-3 focus-within:border-accent">
        <Search size={14} className="shrink-0 text-muted" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search a county, constituency or ward"
          aria-label="Search for a place"
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </div>
      {open && list.length > 0 && (
        <ul className="floating absolute left-0 right-0 top-full z-30 mt-1.5 rounded-lg border border-line bg-surface p-1">
          {list.map((e) => (
            <li key={e.href}>
              <button
                type="button"
                onClick={() => {
                  onPick(e.href);
                  setQ("");
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-accent-soft"
              >
                <span className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-wider text-accent">{e.kind}</span>
                <span className="min-w-0 truncate">{e.name}</span>
                <span className="ml-auto shrink-0 truncate text-xs text-muted">{e.where}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Onboarding({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: (home: Place) => void }) {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState("ke");
  const [c, setC] = useState("");
  const [k, setK] = useState("");
  const [w, setW] = useState("");
  const [lang, setLang] = useState("en");
  const [fix, setFix] = useState<Fix | null>(null);
  const [status, setStatus] = useState<"finding" | "found" | "none" | "asking" | "denied" | "outside">("finding");
  const [asking, setAsking] = useState(false);
  const [detected, setDetected] = useState({ c: "", k: "", w: "" });
  const touched = useRef(false); // the reader has picked something, so a late location result must not overwrite it
  const [geo, setGeo] = useState<{ slug: string; rings: Point[][] } | null>(null);

  const county = counties.find((x) => x.slug === c);
  const constituency = county?.constituencies.find((x) => x.slug === k);
  const regions = otherCountries.find((x) => x.code === country)?.regions ?? [];

  /** Finds county, constituency and ward from a position, one level at a time. Constituency and ward cells are the schematic ones the maps draw until real boundaries load. */
  const drill = async (f: Fix) => {
    const cs = countyAt(f.lat, f.lon);
    if (!cs) return false;
    const cty = counties.find((x) => x.slug === cs)!;
    const g = (await import(`../../_data/generated/county-geo/${cs}.json`)).default as { rings: Point[][] };
    const pt = toCountyMap(cs, f.lat, f.lon);
    let ks = "",
      ws = "";
    if (pt) {
      const cells = partition(g.rings, cty.constituencies.length, cty.code);
      const cell = cells.find((x) => inside(pt, x.polygon));
      const cons = cell ? cty.constituencies[cell.index] : undefined;
      if (cell && cons) {
        ks = cons.slug;
        const wc = partition([cell.polygon], cons.wards.length, cons.code).find((x) => inside(pt, x.polygon));
        if (wc) ws = cons.wards[wc.index].slug;
      }
    }
    setFix(f);
    setCountry("ke");
    setC(cs);
    setK(ks);
    setW(ws);
    setDetected({ c: cs, k: ks, w: ws });
    return true;
  };

  // On open: read where the connection says we are, falling back to the browser's time zone and language.
  useEffect(() => {
    if (!open) return;
    let live = true;
    touched.current = false;
    setStep(0);
    setStatus("finding");
    setC("");
    setK("");
    setW("");
    setFix(null);
    setDetected({ c: "", k: "", w: "" });
    (async () => {
      let place: { country: string; city: string; lat: number | null; lon: number | null } = {
        country: "",
        city: "",
        lat: null,
        lon: null,
      };
      try {
        const r = await fetch("/demo/api/locate", { cache: "no-store" });
        if (r.ok) place = await r.json();
      } catch {}
      const code = COUNTRIES.some((x) => x.code === place.country) ? place.country : guessCountry().code;
      if (!live) return;
      setCountry(code);
      if (!live) return;
      askDevice(); // the device's own position is more exact than the connection's, so it replaces the suggestion when it arrives
      if (code === "ke") {
        if (place.lat != null && place.lon != null && (await drill({ lat: place.lat, lon: place.lon, from: "connection" }))) {
          if (live) setStatus("found");
          return;
        }
        const byCity = counties.find((x) => x.name.toLowerCase() === place.city.toLowerCase());
        if (byCity && live) {
          setC(byCity.slug);
          setDetected({ c: byCity.slug, k: "", w: "" });
          setStatus("found");
          return;
        }
      }
      if (live) setStatus("none");
    })();
    return () => {
      live = false;
    };
  }, [open]);

  // Load the picked county's outline so its constituencies and wards can be ordered by distance from you.
  useEffect(() => {
    if (!c || country !== "ke") {
      setGeo(null);
      return;
    }
    let live = true;
    import(`../../_data/generated/county-geo/${c}.json`).then(
      (m) => live && setGeo({ slug: c, rings: (m.default as { rings: Point[][] }).rings }),
    );
    return () => {
      live = false;
    };
  }, [c, country]);

  const askDevice = (force = false) => {
    if (!("geolocation" in navigator)) return;
    setAsking(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setAsking(false);
        if (touched.current && !force) return;
        const ok = await drill({ lat: pos.coords.latitude, lon: pos.coords.longitude, from: "device" });
        setStatus(ok ? "found" : "outside");
      },
      (err) => {
        setAsking(false);
        if (force || err.code === err.PERMISSION_DENIED) setStatus((s) => (s === "found" ? s : "denied"));
      },
      { timeout: 12000, maximumAge: 600000 },
    );
  };
  const precise = () => {
    touched.current = false;
    setStatus("asking");
    askDevice(true);
  };
  const pickOnMap = async (lat: number, lon: number) => {
    touched.current = true;
    setStatus((await drill({ lat, lon, from: "map" })) ? "found" : "outside");
  };

  /** Chooses a place by name and pins it: the centre of the county, or of the constituency or ward cell. */
  const pickByName = async (href: string) => {
    touched.current = true;
    const [code, cs, ks = "", ws = ""] = demoSegments(href);
    if (code !== "ke") {
      setCountry(code);
      setC(cs ?? "");
      setK("");
      setW("");
      setFix(null);
      setDetected({ c: "", k: "", w: "" });
      setStatus("found");
      return;
    }
    const cty = counties.find((x) => x.slug === cs);
    if (!cty) return;
    const g = (await import(`../../_data/generated/county-geo/${cs}.json`)).default as { rings: Point[][] };
    const cells = partition(g.rings, cty.constituencies.length, cty.code);
    const b = bounds(g.rings.flat());
    let local: Point = [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2];
    const ki = cty.constituencies.findIndex((x) => x.slug === ks);
    if (ki >= 0) {
      const cell = cells[ki];
      local = cell.centroid;
      const cons = cty.constituencies[ki];
      const wi = cons.wards.findIndex((x) => x.slug === ws);
      if (wi >= 0) local = partition([cell.polygon], cons.wards.length, cons.code)[wi]?.centroid ?? local;
    }
    const ll = fromCountyMap(cs, local);
    if (ll) setFix({ ...ll, from: "search" });
    setCountry("ke");
    setC(cs);
    setK(ki >= 0 ? ks : "");
    setW(ws);
    setDetected({ c: cs, k: ki >= 0 ? ks : "", w: ws });
    setStatus("found");
  };

  const point = useMemo(() => (fix && detected.c === c ? toCountyMap(c, fix.lat, fix.lon) : null), [fix, detected.c, c]);
  const dist = (p: Point, cell?: Cell) => (cell ? Math.hypot(cell.centroid[0] - p[0], cell.centroid[1] - p[1]) : 1e9);
  const cells = useMemo(
    () => (county && geo?.slug === c ? partition(geo.rings, county.constituencies.length, county.code) : []),
    [county, geo, c],
  );
  const wardCells = useMemo(() => {
    const cell = constituency ? cells[county!.constituencies.indexOf(constituency)] : undefined;
    return cell && constituency ? partition([cell.polygon], constituency.wards.length, constituency.code) : [];
  }, [cells, constituency, county]);

  /** Every choice, with the detected one first and the nearest next, so the row shows the likeliest and the "…" list holds the rest. */
  const ordered = <T extends { slug: string; name: string }>(list: T[], pick: string, near: (i: number) => number): Chip[] => {
    const order = list
      .map((x, i) => ({ x, d: near(i) }))
      .sort((a, b) => a.d - b.d)
      .map((r) => r.x);
    return [...order.filter((x) => x.slug === pick), ...order.filter((x) => x.slug !== pick)].map((x) => ({
      id: x.slug,
      label: x.name,
      tag: x.slug === pick ? "near you" : undefined,
    }));
  };
  const countyChips: Chip[] = useMemo(() => {
    if (country !== "ke") return regions.map((r) => ({ id: r.slug, label: r.name }));
    const base = detected.c || c;
    const near = base ? nearbyCounties(base, 46) : [];
    const first = base ? [base, ...near] : counties.map((x) => x.slug);
    return first.map((s) => ({
      id: s,
      label: counties.find((x) => x.slug === s)?.name ?? s,
      tag: s === detected.c ? "near you" : undefined,
    }));
  }, [country, detected.c, c, regions]);
  const consChips = county
    ? ordered(county.constituencies, detected.c === c ? detected.k : "", (i) => (point ? dist(point, cells[i]) : i))
    : [];
  const wardChips = constituency
    ? ordered(constituency.wards, detected.k === k && detected.c === c ? detected.w : "", (i) =>
        point && detected.k === k ? dist(point, wardCells[i]) : i,
      )
    : [];
  const countryChips: Chip[] = COUNTRIES.map((x) => ({ id: x.code, label: x.name, icon: <Flag code={x.code} size={16} /> }));
  const langs = useMemo(() => languagesForArea(country === "ke" ? c : undefined), [country, c]);
  useEffect(() => {
    if (open) setThemeCountry(country);
  }, [open, country]); // lets the flag colours option follow the country chosen here

  const trail = country === "ke" ? [c, k, w].filter(Boolean) : [c].filter(Boolean);
  const save = () => {
    const home: Place = { country, trail };
    writeHome(home);
    writeLang(lang);
    onDone(home);
  };
  const names = [
    county?.name ?? regions.find((r) => r.slug === c)?.name,
    constituency?.name,
    constituency?.wards.find((x) => x.slug === w)?.name,
  ].filter(Boolean);

  const statusLine = {
    finding: (
      <>
        <Loader2 size={13} className="animate-spin" />
        Finding your area…
      </>
    ),
    asking: (
      <>
        <Loader2 size={13} className="animate-spin" />
        Waiting for your device…
      </>
    ),
    found: (
      <>
        <MapPin size={13} className="shrink-0 text-accent" />
        <span className="truncate">
          {names.length ? `${names.join(" › ")} · ` : ""}
          {fix?.from === "device"
            ? "from your device"
            : fix?.from === "map"
              ? "from the map"
              : fix?.from === "search"
                ? "from your search"
                : "from your connection"}
        </span>
      </>
    ),
    none: <>Search, click the map or choose below.</>,
    outside: <>That spot is outside the counties we have.</>,
    denied: <>Location is blocked. Search or click the map.</>,
  }[status];

  return (
    <DialogShell
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title="Set up your place"
      description={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`}
      icon={<MapPin size={16} />}
      maxWidth="max-w-xl"
      panelClassName="h-[min(660px,92vh)]"
      progress={(step + 1) / STEPS.length}
      footerLeft={
        <button onClick={onClose} className="text-sm text-muted hover:text-ink">
          Skip for now
        </button>
      }
      footerRight={
        <>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className={buttonClass.outline}>
              Back
            </button>
          )}
          {step < 1 ? (
            <button onClick={() => setStep(1)} disabled={!c && status === "finding"} className={buttonClass.primary}>
              {c ? "Next" : "Skip place"}
            </button>
          ) : (
            <button onClick={save} className={buttonClass.primary}>
              Done
            </button>
          )}
        </>
      }
    >
      <div className="divide-y divide-line px-5 text-sm">
        {step === 0 && (
          <>
            <Part label="Country">
              <CountrySelect
                items={countryChips}
                value={country}
                onPick={(id) => {
                  if (id !== country) {
                    touched.current = true;
                    setCountry(id);
                    setC("");
                    setK("");
                    setW("");
                    setFix(null);
                  }
                }}
              />
            </Part>
            <Part label="Find your location">
              <div className="flex gap-2">
                <button
                  onClick={precise}
                  disabled={asking}
                  className="flex h-9 shrink-0 items-center gap-2 rounded-md border border-line px-3 text-sm hover:bg-accent-soft disabled:opacity-60"
                >
                  <Crosshair size={14} />
                  {asking ? "Waiting…" : "My location"}
                </button>
                <PlaceSearch onPick={pickByName} />
              </div>
              <OsmMap
                className="mt-2 h-32"
                home={fix ? { lat: fix.lat, lon: fix.lon, z: 10 } : (HOME[country] ?? HOME.ke)}
                pin={fix}
                onPick={pickOnMap}
              />
              <p role="status" className="mt-1.5 flex h-4 items-center gap-2 text-xs text-muted">
                {statusLine}
              </p>
            </Part>
            <Part label={country === "ke" ? "County" : (COUNTRIES.find((x) => x.code === country)?.levels[0] ?? "Region")}>
              <div className="flex h-[30px] items-center">
                <ChipRow
                  label="County"
                  items={countyChips}
                  value={c}
                  onPick={(id) => {
                    touched.current = true;
                    setC(id);
                    setK("");
                    setW("");
                  }}
                />
              </div>
            </Part>
            {country === "ke" && (
              <>
                <Part label="Constituency">
                  <div className="flex h-[30px] items-center">
                    {county ? (
                      <ChipRow
                        label="Constituency"
                        items={consChips}
                        value={k}
                        onPick={(id) => {
                          setK(id);
                          setW("");
                        }}
                      />
                    ) : (
                      <span className="text-xs text-muted">Choose a county first</span>
                    )}
                  </div>
                </Part>
                <Part label="Ward">
                  <div className="flex h-[30px] items-center">
                    {constituency ? (
                      <ChipRow label="Ward" items={wardChips} value={w} onPick={setW} />
                    ) : (
                      <span className="text-xs text-muted">Choose a constituency first</span>
                    )}
                  </div>
                </Part>
              </>
            )}
          </>
        )}
        {step === 1 && (
          <div className="space-y-5 py-4">
            <fieldset>
              <legend className="mb-2 font-medium">Language</legend>
              <div className="grid grid-cols-2 gap-2">
                {langs.map((l) => (
                  <button
                    key={l.code}
                    disabled={!l.available}
                    aria-pressed={lang === l.code}
                    onClick={() => setLang(l.code)}
                    className={`rounded-md border px-3 py-2 text-left transition ${lang === l.code ? "border-accent bg-accent-soft" : "border-line"} ${l.available ? "hover:border-muted" : "opacity-50"}`}
                  >
                    {l.name}
                    <span className="block text-xs text-muted">
                      {l.native}
                      {!l.available && " · coming later"}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">
                Languages spoken around your area are listed. Only English and Kiswahili are available today.
              </p>
            </fieldset>
            <fieldset>
              <legend className="mb-2 flex items-center gap-2 font-medium">
                <Palette size={14} />
                Look
              </legend>
              <ThemeSwitcher flagOpen />
            </fieldset>
          </div>
        )}
      </div>
    </DialogShell>
  );
}
