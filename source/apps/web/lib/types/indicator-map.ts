import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type IndicatorMapIndicator } from "#/lib/types/indicator-map-indicator.ts";
import { type IndicatorMapUnits } from "#/lib/types/indicator-map-units.ts";
import { type PlaceCrumb } from "#/lib/types/place-crumb.ts";

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
