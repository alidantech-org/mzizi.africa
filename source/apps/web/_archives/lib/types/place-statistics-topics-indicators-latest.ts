import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Place Statistics Topics Indicators Latest */
export interface PlaceStatisticsTopicsIndicatorsLatest {
  estimated: boolean;
  period: string;
  value: number;
}

/** Field metadata for forms and results. */
export const PlaceStatisticsTopicsIndicatorsLatestFields: readonly FieldMeta[] =
  [
    { name: "estimated", label: "Estimated", kind: "boolean", required: true },
    { name: "period", label: "Period", kind: "string", required: true },
    { name: "value", label: "Value", kind: "number", required: true },
  ];
