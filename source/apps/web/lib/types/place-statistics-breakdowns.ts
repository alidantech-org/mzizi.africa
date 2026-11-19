import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceStatisticsBreakdownsAge } from "#/lib/types/place-statistics-breakdowns-age.ts";
import { type PlaceStatisticsBreakdownsCommunity } from "#/lib/types/place-statistics-breakdowns-community.ts";
import { type PlaceStatisticsBreakdownsLanguage } from "#/lib/types/place-statistics-breakdowns-language.ts";
import { type PlaceStatisticsBreakdownsResidence } from "#/lib/types/place-statistics-breakdowns-residence.ts";
import { type PlaceStatisticsBreakdownsSex } from "#/lib/types/place-statistics-breakdowns-sex.ts";

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
