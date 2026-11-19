import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceCivicYearsClasses } from "#/lib/types/place-civic-years-classes.ts";

/** Place Civic Years */
export interface PlaceCivicYears {
  classes: PlaceCivicYearsClasses[];
  total: number;
  year: number;
}

/** Field metadata for forms and results. */
export const PlaceCivicYearsFields: readonly FieldMeta[] = [
  { name: "classes", label: "Classes", kind: "other", required: true },
  { name: "total", label: "Total", kind: "number", required: true },
  { name: "year", label: "Year", kind: "number", required: true },
];
