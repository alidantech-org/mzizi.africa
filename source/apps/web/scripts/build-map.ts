/** Turns boundary GeoJSON into compact SVG shapes: our own map, no tiles, no map service. */
import { readFileSync, writeFileSync } from "node:fs";

type Ring = [number, number][];
type Geometry = { type: "Polygon"; coordinates: Ring[] } | { type: "MultiPolygon"; coordinates: Ring[][] };
type Feature = { properties: { shapeName: string; shapeISO: string }; geometry: Geometry };
type Collection = { features: Feature[] };

const WIDTH = 640;
const TOLERANCE = 0.012; // degrees; larger means simpler shapes

const read = (file: string): Collection => JSON.parse(readFileSync(file, "utf8"));

/** Ramer-Douglas-Peucker line simplification. */
function simplify(points: Ring, tolerance: number): Ring {
  if (points.length < 3) return points;
  const [a, b] = [points[0], points[points.length - 1]];
  let index = 0;
  let max = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const length = dx * dx + dy * dy || 1e-12;
    const t = Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / length));
    const d = Math.hypot(px - (a[0] + t * dx), py - (a[1] + t * dy));
    if (d > max) [max, index] = [d, i];
  }
  if (max <= tolerance) return [a, b];
  return [...simplify(points.slice(0, index + 1), tolerance).slice(0, -1), ...simplify(points.slice(index), tolerance)];
}

const polygons = (g: Geometry): Ring[][] => (g.type === "Polygon" ? [g.coordinates] : g.coordinates);

const collection = read("scripts/geo-input/KEN-ADM1-simplified.geojson");
const outline = read("scripts/geo-input/KEN-ADM0-simplified.geojson");

const all = [...collection.features, ...outline.features].flatMap((f) => polygons(f.geometry).flat(2));
const lon0 = Math.min(...all.map((p) => p[0]));
const lon1 = Math.max(...all.map((p) => p[0]));
const lat0 = Math.min(...all.map((p) => p[1]));
const lat1 = Math.max(...all.map((p) => p[1]));
const midLat = ((lat0 + lat1) / 2) * (Math.PI / 180);
const scale = WIDTH / ((lon1 - lon0) * Math.cos(midLat)); // equirectangular, corrected at mid latitude
const HEIGHT = Math.round((lat1 - lat0) * scale);
const project = ([lon, lat]: [number, number]) => [(lon - lon0) * Math.cos(midLat) * scale, (lat1 - lat) * scale] as const;

function path(g: Geometry): { d: string; cx: number; cy: number } {
  let d = "";
  let best = 0;
  let cx = 0;
  let cy = 0;
  for (const polygon of polygons(g)) {
    for (const ring of polygon) {
      const pts = simplify(ring, TOLERANCE).map(project);
      if (pts.length < 4) continue;
      d += "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + "Z";
    }
    const outer = polygon[0].map(project);
    let area = 0;
    let sx = 0;
    let sy = 0;
    for (let i = 0; i < outer.length - 1; i++) {
      const [x0, y0] = outer[i];
      const [x1, y1] = outer[i + 1];
      const cross = x0 * y1 - x1 * y0;
      area += cross;
      sx += (x0 + x1) * cross;
      sy += (y0 + y1) * cross;
    }
    if (Math.abs(area) > best && area !== 0) {
      best = Math.abs(area);
      cx = sx / (3 * area);
      cy = sy / (3 * area);
    }
  }
  return { d, cx: Math.round(cx), cy: Math.round(cy) };
}

const regions = collection.features.map((f) => ({
  code: f.properties.shapeISO,
  name: f.properties.shapeName,
  ...path(f.geometry),
}));
const country = outline.features.map((f) => path(f.geometry).d).join("");

writeFileSync(
  "src/app/demo/_data/maps/kenya.json",
  JSON.stringify({ width: WIDTH, height: HEIGHT, proj: { lon0, lat1, cos: Math.cos(midLat), scale }, country, regions }),
);
console.log(`kenya: ${regions.length} regions, ${(JSON.stringify(regions).length / 1024).toFixed(0)} KB`);
