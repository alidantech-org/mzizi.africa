import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type IndicatorMapIndicator } from "#/_archives/lib/types/indicator-map-indicator";
import { type IndicatorMapUnits } from "#/_archives/lib/types/indicator-map-units";
import { type PlaceCrumb } from "#/_archives/lib/types/place-crumb";

/** Indicator Map */
export interface IndicatorMap {
  gaps: string[];
  indicator: IndicatorMapIndicator;
  parent?: PlaceCrumb | null;
  periodFrom?: string | null;
  units: IndicatorMapUnits[];
}

/** Field metadata for forms and results. */
export const IndicatorMapFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "indicator", label: "Indicator", kind: "other", required: true },
  { name: "parent", label: "Parent", kind: "other", required: false },
  { name: "periodFrom", label: "Period From", kind: "date", required: false },
  { name: "units", label: "Units", kind: "other", required: true },
];
