import "server-only";
/**
 * Parse boundary for GeoJSON in API responses. Dryv's query-derived response schemas drop geometry columns (recorded in
 * DRYV_GAPS), so the generated types omit `geometry` although the API sends it. This is the one place that reads it.
 */
export type Position = [number, number];
export type Area = { type: "Polygon"; rings: Position[][] } | { type: "MultiPolygon"; rings: Position[][] };

const isPosition = (value: unknown): value is Position =>
  Array.isArray(value) && value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number";
const isRing = (value: unknown): value is Position[] => Array.isArray(value) && value.every(isPosition);

/** The polygon rings of `record.geometry`, or null when it is missing or not an area. */
export function readArea(record: object): Area | null {
  const geometry: unknown = Reflect.get(record, "geometry");
  if (typeof geometry !== "object" || geometry === null) return null;
  const type: unknown = Reflect.get(geometry, "type");
  const coordinates: unknown = Reflect.get(geometry, "coordinates");
  if (type === "Polygon" && Array.isArray(coordinates) && coordinates.every(isRing)) return { type, rings: coordinates };
  if (type === "MultiPolygon" && Array.isArray(coordinates) && coordinates.every((p) => Array.isArray(p) && p.every(isRing)))
    return { type, rings: coordinates.flat() };
  return null;
}
