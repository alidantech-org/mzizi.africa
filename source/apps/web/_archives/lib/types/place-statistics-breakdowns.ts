import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type PlaceStatisticsBreakdownsAge } from "#/_archives/lib/types/place-statistics-breakdowns-age";
import { type PlaceStatisticsBreakdownsCommunity } from "#/_archives/lib/types/place-statistics-breakdowns-community";
import { type PlaceStatisticsBreakdownsLanguage } from "#/_archives/lib/types/place-statistics-breakdowns-language";
import { type PlaceStatisticsBreakdownsResidence } from "#/_archives/lib/types/place-statistics-breakdowns-residence";
import { type PlaceStatisticsBreakdownsSex } from "#/_archives/lib/types/place-statistics-breakdowns-sex";

/** Place Statistics Breakdowns */
export interface PlaceStatisticsBreakdowns {
  age?: PlaceStatisticsBreakdownsAge[];
  community?: PlaceStatisticsBreakdownsCommunity[];
  language?: PlaceStatisticsBreakdownsLanguage[];
  residence?: PlaceStatisticsBreakdownsResidence[];
  sex?: PlaceStatisticsBreakdownsSex[];
}

/** Field metadata for forms and results. */
export const PlaceStatisticsBreakdownsFields: readonly FieldMeta[] = [
  { name: "age", label: "Age", kind: "other", required: false },
  { name: "community", label: "Community", kind: "other", required: false },
  { name: "language", label: "Language", kind: "other", required: false },
  { name: "residence", label: "Residence", kind: "other", required: false },
  { name: "sex", label: "Sex", kind: "other", required: false },
];
