import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Position Input */
export interface PositionInput {
  languageCode?: string;
  latitude: number;
  longitude: number;
  onDate?: string;
}

/** Field metadata for forms and results. */
export const PositionInputFields: readonly FieldMeta[] = [
  {
    name: "languageCode",
    label: "Language Code",
    kind: "string",
    required: false,
  },
  { name: "latitude", label: "Latitude", kind: "number", required: true },
  { name: "longitude", label: "Longitude", kind: "number", required: true },
  { name: "onDate", label: "On Date", kind: "date", required: false },
];
