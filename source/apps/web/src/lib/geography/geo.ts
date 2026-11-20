/** GPS to county: project the point the same way the map was drawn, then test it against each county shape. */
import { countyShapes } from "#demo/_data/places";

type Pt = [number, number];
const rings = (d: string): Pt[][] =>
  d
    .split("M")
    .filter(Boolean)
    .map((r) =>
      r
        .replace("Z", "")
        .split("L")
        .map((p) => p.trim().split(" ").map(Number) as Pt),
    );
const inside = (p: Pt, ring: Pt[]) => {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i],
      [xj, yj] = ring[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};

/** Returns the county slug containing the point, or null if the point is outside Kenya's counties. */
export function countyAt(lat: number, lon: number): string | null {
  const { proj, shapes } = countyShapes as unknown as {
    proj: { lon0: number; lat1: number; cos: number; scale: number };
    shapes: { code: string; d: string }[];
  };
  const p: Pt = [(lon - proj.lon0) * proj.cos * proj.scale, (proj.lat1 - lat) * proj.scale];
  const hit = shapes.find((s) => rings(s.d).some((r) => inside(p, r)));
  return hit ? hit.code.replace(/^ke\./, "") : null;
}

export function guessCountry(): { code: string; reason: string } {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  const byZone: Record<string, string> = {
    "Africa/Nairobi": "ke",
    "Africa/Johannesburg": "za",
    "Africa/Lagos": "ng",
    "Africa/Dar_es_Salaam": "tz",
  };
  if (byZone[zone]) return { code: byZone[zone], reason: `your time zone (${zone})` };
  const region = navigator.language.split("-")[1]?.toLowerCase();
  if (region && ["ke", "za", "ng", "tz"].includes(region))
    return { code: region, reason: `your browser language (${navigator.language})` };
  return { code: "ke", reason: "the default country" };
}

type Pt2 = [number, number];
type NationalShapes = {
  proj: { lon0: number; lat1: number; cos: number; scale: number };
  shapes: { code: string; name: string; d: string; cx: number; cy: number }[];
};
const national = () => countyShapes as unknown as NationalShapes;
const project = (lat: number, lon: number): Pt2 => {
  const { proj } = national();
  return [(lon - proj.lon0) * proj.cos * proj.scale, (proj.lat1 - lat) * proj.scale];
};

/** How a county's own map relates to the national one: its corner and scale. */
function countyFrame(slug: string) {
  const shape = national().shapes.find((s) => s.code === `ke.${slug}`);
  if (!shape) return null;
  const pts = rings(shape.d).flat();
  const x0 = Math.min(...pts.map((p) => p[0])),
    x1 = Math.max(...pts.map((p) => p[0])),
    y0 = Math.min(...pts.map((p) => p[1]));
  return { x0, y0, k: 600 / (x1 - x0) }; // the county maps are the county outline scaled to 600 wide
}

/** The point in a county's own map (the drawing the county page uses), so it can be placed among that county's cells. */
export function toCountyMap(slug: string, lat: number, lon: number): Pt2 | null {
  const f = countyFrame(slug);
  if (!f) return null;
  const [x, y] = project(lat, lon);
  return [(x - f.x0) * f.k, (y - f.y0) * f.k];
}

/** The reverse: a point in a county's own map as latitude and longitude. */
export function fromCountyMap(slug: string, p: Pt2): { lat: number; lon: number } | null {
  const f = countyFrame(slug);
  if (!f) return null;
  const { proj } = national();
  return { lat: proj.lat1 - (p[1] / f.k + f.y0) / proj.scale, lon: (p[0] / f.k + f.x0) / (proj.cos * proj.scale) + proj.lon0 };
}

/** Counties ordered by how close they are to the given one, nearest first. Used for "around you" suggestions. */
export function nearbyCounties(slug: string, count: number): string[] {
  const here = national().shapes.find((s) => s.code === `ke.${slug}`);
  if (!here) return [];
  return national()
    .shapes.filter((s) => s !== here)
    .map((s) => ({ slug: s.code.replace(/^ke\./, ""), d: Math.hypot(s.cx - here.cx, s.cy - here.cy) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, count)
    .map((s) => s.slug);
}

/** The national map position of a county's centre, used to order other places by distance. */
export const countyCentre = (slug: string): Pt2 | null => {
  const s = national().shapes.find((x) => x.code === `ke.${slug}`);
  return s ? [s.cx, s.cy] : null;
};

/** Plausible country from the browser's time zone and language. Nothing leaves the device. */
