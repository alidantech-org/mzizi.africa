import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type IndicatorSeriesIndicator } from "#/_archives/lib/types/indicator-series-indicator";
import { type IndicatorSeriesPoints } from "#/_archives/lib/types/indicator-series-points";
import { type PlaceCrumb } from "#/_archives/lib/types/place-crumb";

/** Indicator Series */
export interface IndicatorSeries {
  gaps: string[];
  indicator: IndicatorSeriesIndicator;
  place: PlaceCrumb;
  points: IndicatorSeriesPoints[];
}

/** Field metadata for forms and results. */
export const IndicatorSeriesFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "indicator", label: "Indicator", kind: "other", required: true },
  { name: "place", label: "Place", kind: "other", required: true },
  { name: "points", label: "Points", kind: "other", required: true },
];
