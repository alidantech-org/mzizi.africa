import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceCrumb } from "#/lib/types/place-crumb.ts";

/** Indicator Series */
export interface IndicatorSeries {
  gaps: string[];
  indicator: unknown;
  place: PlaceCrumb;
  points: unknown[];
}

/** Field metadata for forms and results. */
export const IndicatorSeriesFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "indicator", label: "Indicator", kind: "other", required: true },
  { name: "place", label: "Place", kind: "other", required: true },
  { name: "points", label: "Points", kind: "other", required: true },
];
