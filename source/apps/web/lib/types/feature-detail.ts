import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { DatePrecision } from "#/lib/types/date-precision.enum.ts";
import { type FeatureDetailNames } from "#/lib/types/feature-detail-names.ts";

/** Feature Detail */
export interface FeatureDetail {
  code: string;
  featureId: string;
  featureTypeId: string;
  fromToPrecision: DatePrecision | null;
  fromYear: number | null;
  names: FeatureDetailNames[];
  toYear: number | null;
}

/** Field metadata for forms and results. */
export const FeatureDetailFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "featureTypeId", label: "Feature Type Id", kind: "string", required: true },
  {
    name: "fromToPrecision",
    label: "From To Precision",
    kind: "enum",
    required: false,
    options: Object.values(DatePrecision),
  },
  { name: "fromYear", label: "From Year", kind: "number", required: false },
  { name: "names", label: "Names", kind: "other", required: true },
  { name: "toYear", label: "To Year", kind: "number", required: false },
];
