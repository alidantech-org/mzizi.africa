/** Turns GeoJSON outlines from the backend into SVG paths on one shared canvas. Pure and server-safe. */

export type BoundaryLike = { address: string; name: string; kind: string; geometry: string; bbox: number[]; population?: number | null; childCount: number };
export type MapShape = { address: string; name: string; kind: string; d: string; population: number | null; childCount: number };
export type MapCanvas = { width: number; height: number; shapes: MapShape[] };

type Ring = number[][];
type Geometry = { type: "Polygon"; coordinates: Ring[] } | { type: "MultiPolygon"; coordinates: Ring[][] };

const WIDTH = 1000;

/**
 * Equirectangular projection corrected by the cosine of the middle latitude, so a county is not stretched
 * sideways. The canvas is 1000 wide; its height follows the aspect ratio of the drawn area.
 */
export function project(shapes: readonly BoundaryLike[], bbox: readonly number[]): MapCanvas {
  const [west = 0, south = 0, east = 1, north = 1] = bbox;
  const k = Math.cos((((south + north) / 2) * Math.PI) / 180);
  const spanX = Math.max((east - west) * k, 1e-9);
  const spanY = Math.max(north - south, 1e-9);
  const scale = WIDTH / spanX;
  const height = Math.max(1, Math.round(spanY * scale));
  const point = ([lon, lat]: number[]) => `${((lon! - west) * k * scale).toFixed(1)} ${((north - lat!) * scale).toFixed(1)}`;
  const ring = (r: Ring) => `M${r.map(point).join("L")}Z`;
  return {
    width: WIDTH,
    height,
    shapes: shapes.map((s) => {
      const g = JSON.parse(s.geometry) as Geometry;
      const polygons = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
      return {
        address: s.address,
        name: s.name,
        kind: s.kind,
        d: polygons.map((p) => p.map(ring).join("")).join(""),
        population: s.population ?? null,
        childCount: s.childCount,
      };
    }),
  };
}
