import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Compare Options Nearby */
export interface CompareOptionsNearby {
  distanceKm: number;
  featureId: string;
  kindLabel: string;
  name: string;
  path: string;
}

/** Field metadata for forms and results. */
export const CompareOptionsNearbyFields: readonly FieldMeta[] = [
  { name: "distanceKm", label: "Distance Km", kind: "number", required: true },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "kindLabel", label: "Kind Label", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "path", label: "Path", kind: "string", required: true },
];
