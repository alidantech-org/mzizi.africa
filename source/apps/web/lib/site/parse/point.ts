/** GeoJSON parsing boundary for legacy operations until their geometry contracts are regenerated. */
export function parsePoint(value: unknown): GeoJSON.Point | null {
  if (value === null || typeof value !== "object" || Reflect.get(value, "type") !== "Point") return null;
  const coordinates: unknown = Reflect.get(value, "coordinates");
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;
  const longitude: unknown = coordinates[0];
  const latitude: unknown = coordinates[1];
  if (typeof longitude !== "number" || typeof latitude !== "number" || !Number.isFinite(longitude) || !Number.isFinite(latitude) || Math.abs(longitude) > 180 || Math.abs(latitude) > 90) return null;
  return { type: "Point", coordinates: [longitude, latitude] };
}
