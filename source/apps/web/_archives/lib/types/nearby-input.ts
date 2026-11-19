import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Nearby Input */
export interface NearbyInput {
  latitude: number;
  longitude: number;
  radiusKm?: number;
}

/** Field metadata for forms and results. */
export const NearbyInputFields: readonly FieldMeta[] = [
  { name: "latitude", label: "Latitude", kind: "number", required: true },
  { name: "longitude", label: "Longitude", kind: "number", required: true },
  { name: "radiusKm", label: "Radius Km", kind: "number", required: false },
];
