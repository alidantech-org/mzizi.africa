/** Same-level comparison: county with county, ward with ward, country with country. Demo values for sub-national levels. */
import { countyDemo, indicators } from "#/data/demo";
import { counties, countyShapes, otherCountries } from "#/data/places";
import type { Place } from "./route";

export type Level = "country" | "county" | "constituency" | "ward";
export type Entity = { code: string; name: string; level: Level; parent?: string; parentName?: string; place: Place };

export const levelOf = (p: Place): Level => (p.trail.length === 0 ? "country" : p.country !== "ke" ? "county" : (["county", "constituency", "ward"][p.trail.length - 1] as Level));
export const levelName: Record<Level, string> = { country: "country", county: "county", constituency: "constituency", ward: "ward" };

const hash = (s: string) => [...s].reduce((h, c) => (Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0), 2166136261);
const unit = (s: string) => (hash(s) % 10000) / 10000;

export const KENYA_COUNTRIES = [{ code: "ke", name: "Kenya", iso: "KEN" }, ...otherCountries.map((c) => ({ code: c.code, name: c.name, iso: c.iso }))];

/** Every entity of a level inside the comparison scope (the whole country, or the county for constituencies and wards). */
export function entitiesAt(level: Level, place: Place): Entity[] {
  if (level === "country") return KENYA_COUNTRIES.map((c) => ({ code: c.code, name: c.name, level, place: { country: c.code, trail: [] } }));
  if (place.country !== "ke") return [];
  if (level === "county") return counties.map((c) => ({ code: c.code, name: c.name, level, place: { country: "ke", trail: [c.slug] } }));
  const county = counties.find((c) => c.slug === place.trail[0]);
  if (!county) return [];
  if (level === "constituency") return county.constituencies.map((k) => ({ code: k.code, name: k.name, level, parent: county.code, parentName: county.name, place: { country: "ke", trail: [county.slug, k.slug] } }));
  return county.constituencies.flatMap((k) => k.wards.map((w) => ({ code: w.code, name: w.name, level, parent: k.code, parentName: `${k.name}, ${county.name}`, place: { country: "ke", trail: [county.slug, k.slug, w.slug] } })));
}

/** Indicator values. Counties use the shared demo table; deeper levels follow their county with their own variation. */
export function valuesOf(e: Entity): Record<string, number> {
  const county = countyDemo.find((c) => c.code === (e.level === "county" ? e.code : e.code.split(".").slice(0, 2).join(".")));
  const out: Record<string, number> = {};
  for (const ind of indicators) {
    if (e.level === "county" && county) { out[ind.id] = county.values[ind.id]; continue; }
    const base = county?.values[ind.id] ?? ind.national;
    out[ind.id] = Math.max(6, Math.min(99, Math.round(base + (unit(e.code + ind.id) - 0.5) * (e.level === "ward" ? 26 : 18))));
  }
  return out;
}
export const overall = (e: Entity) => { const v = valuesOf(e); return indicators.reduce((n, i) => n + (i.better === "low" ? 100 - v[i.id] : v[i.id]), 0) / indicators.length; };

/** Closest first. Counties by map distance; deeper levels by position inside the same parent (a schematic proxy). */
export function nearest(from: Entity, pool: Entity[], n: number): Entity[] {
  const others = pool.filter((e) => e.code !== from.code);
  if (from.level === "county") {
    const c = (code: string) => countyShapes.shapes.find((s) => s.code === code)!;
    const a = c(from.code);
    return others.sort((x, y) => Math.hypot(c(x.code).cx - a.cx, c(x.code).cy - a.cy) - Math.hypot(c(y.code).cx - a.cx, c(y.code).cy - a.cy)).slice(0, n);
  }
  const at = pool.findIndex((e) => e.code === from.code);
  return others.sort((x, y) => Math.abs(pool.indexOf(x) - at) - Math.abs(pool.indexOf(y) - at)).slice(0, n);
}
export const top = (pool: Entity[], n: number, skip: string[] = []) => pool.filter((e) => !skip.includes(e.code)).sort((a, b) => overall(b) - overall(a)).slice(0, n);

/** The entity of the user's home place that sits at this level, if their home is at least that deep. */
export function homeAt(level: Level, home: Place | null): Place | null {
  if (!home) return null;
  const depth = { country: 0, county: 1, constituency: 2, ward: 3 }[level];
  return home.trail.length >= depth ? { country: home.country, trail: home.trail.slice(0, depth) } : null;
}
