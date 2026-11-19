import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Indicator Map Units */
export interface IndicatorMapUnits {
  estimated: boolean;
  featureId: string;
  geometry?: unknown | null;
  kind: string;
  name: string;
  path: string;
  rank: number;
  value: number;
}

/** Field metadata for forms and results. */
export const IndicatorMapUnitsFields: readonly FieldMeta[] = [
  { name: "estimated", label: "Estimated", kind: "boolean", required: true },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "geometry", label: "Geometry", kind: "other", required: false },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "path", label: "Path", kind: "string", required: true },
  { name: "rank", label: "Rank", kind: "number", required: true },
  { name: "value", label: "Value", kind: "number", required: true },
];
