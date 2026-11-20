/**
 * Splits a shape into n schematic cells (relaxed Voronoi), so a county can show its constituencies and a
 * constituency its wards before real boundary polygons are loaded. Deterministic: same input, same cells.
 */
import { Delaunay } from "d3-delaunay";

export type Point = [number, number];
export type Cell = { index: number; polygon: Point[]; centroid: Point };

const hash = (text: string) => [...text].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
function rng(seed: number) {
  let a = seed || 1;
  return () => (a = (Math.imul(a, 1664525) + 1013904223) >>> 0) / 4294967296;
}

export function inside(point: Point, ring: Point[]): boolean {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > point[1] !== yj > point[1] && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

export const bounds = (ring: Point[]) => {
  const xs = ring.map((p) => p[0]);
  const ys = ring.map((p) => p[1]);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
};

const centroidOf = (poly: Point[]): Point => {
  let a = 0,
    x = 0,
    y = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i];
    const [x1, y1] = poly[(i + 1) % poly.length];
    const cross = x0 * y1 - x1 * y0;
    a += cross;
    x += (x0 + x1) * cross;
    y += (y0 + y1) * cross;
  }
  return a ? [x / (3 * a), y / (3 * a)] : poly[0];
};

/** `outline` may be a county ring or a cell polygon. `rings` lets a multi-island county accept points in any part. */
export function partition(outline: Point[][], n: number, key: string): Cell[] {
  const main = outline.reduce((a, b) => (b.length > a.length ? b : a));
  const all = outline.flat();
  const b = bounds(all);
  const random = rng(hash(key));
  const accept = (p: Point) => outline.some((r) => inside(p, r));
  let seeds: Point[] = [];
  let guard = 0;
  while (seeds.length < n && guard++ < 20000) {
    const p: Point = [b.x0 + random() * (b.x1 - b.x0), b.y0 + random() * (b.y1 - b.y0)];
    if (
      accept(p) &&
      seeds.every((s) => Math.hypot(s[0] - p[0], s[1] - p[1]) > Math.max(b.x1 - b.x0, b.y1 - b.y0) / (Math.sqrt(n) * 3.2))
    )
      seeds.push(p);
  }
  while (seeds.length < n) seeds.push([main[seeds.length % main.length][0], main[seeds.length % main.length][1]]);

  for (let round = 0; round < 4; round++) {
    const v = Delaunay.from(seeds).voronoi([b.x0, b.y0, b.x1, b.y1]);
    seeds = seeds.map((s, i) => {
      const poly = v.cellPolygon(i);
      if (!poly) return s;
      const c = centroidOf(poly.slice(0, -1) as Point[]);
      return accept(c) ? c : s;
    });
  }
  const v = Delaunay.from(seeds).voronoi([b.x0, b.y0, b.x1, b.y1]);
  return seeds.map((s, i) => {
    const polygon = (v.cellPolygon(i) ?? [s]).slice(0, -1) as Point[];
    const c = centroidOf(polygon);
    return { index: i, polygon, centroid: accept(c) ? c : s };
  });
}

export const pathOf = (poly: Point[]) => "M" + poly.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + "Z";
