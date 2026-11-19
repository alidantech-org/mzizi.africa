import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Compare Options Place */
export interface CompareOptionsPlace {
  featureId: string;
  kindCode: string;
  kindLabel: string;
  name: string;
  path: string;
}

/** Field metadata for forms and results. */
export const CompareOptionsPlaceFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "kindCode", label: "Kind Code", kind: "string", required: true },
  { name: "kindLabel", label: "Kind Label", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "path", label: "Path", kind: "string", required: true },
];
