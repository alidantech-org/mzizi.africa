import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Place Child */
export interface PlaceChild {
  childCount: number;
  featureId: string;
  kindCode: string;
  kindLabel: string;
  name: string;
  population?: number | null;
}

/** Field metadata for forms and results. */
export const PlaceChildFields: readonly FieldMeta[] = [
  { name: "childCount", label: "Child Count", kind: "number", required: true },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "kindCode", label: "Kind Code", kind: "string", required: true },
  { name: "kindLabel", label: "Kind Label", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "population", label: "Population", kind: "number", required: false },
];
