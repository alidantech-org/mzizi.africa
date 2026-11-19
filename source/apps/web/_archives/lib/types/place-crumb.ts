import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Place Crumb */
export interface PlaceCrumb {
  featureId: string;
  kindCode: string;
  kindLabel: string;
  name: string;
  path?: string | null;
}

/** Field metadata for forms and results. */
export const PlaceCrumbFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "kindCode", label: "Kind Code", kind: "string", required: true },
  { name: "kindLabel", label: "Kind Label", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "path", label: "Path", kind: "string", required: false },
];
