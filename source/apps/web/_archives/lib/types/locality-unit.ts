import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Locality Unit */
export interface LocalityUnit {
  code: string;
  depth: number;
  featureId: string;
  kindCode: string;
  kindLabel: string;
  name: string;
}

/** Field metadata for forms and results. */
export const LocalityUnitFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "depth", label: "Depth", kind: "number", required: true },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "kindCode", label: "Kind Code", kind: "string", required: true },
  { name: "kindLabel", label: "Kind Label", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
];
