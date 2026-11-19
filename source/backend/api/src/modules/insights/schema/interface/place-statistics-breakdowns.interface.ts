import type { PlaceStatisticsBreakdownsAge } from "#/modules/insights/schema/interface/place-statistics-breakdowns-age.interface.ts";
import type { PlaceStatisticsBreakdownsCommunity } from "#/modules/insights/schema/interface/place-statistics-breakdowns-community.interface.ts";
import type { PlaceStatisticsBreakdownsLanguage } from "#/modules/insights/schema/interface/place-statistics-breakdowns-language.interface.ts";
import type { PlaceStatisticsBreakdownsResidence } from "#/modules/insights/schema/interface/place-statistics-breakdowns-residence.interface.ts";
import type { PlaceStatisticsBreakdownsSex } from "#/modules/insights/schema/interface/place-statistics-breakdowns-sex.interface.ts";

/** Place Statistics Breakdowns */
export interface PlaceStatisticsBreakdowns {
  age?: PlaceStatisticsBreakdownsAge[];
  community?: PlaceStatisticsBreakdownsCommunity[];
  language?: PlaceStatisticsBreakdownsLanguage[];
  residence?: PlaceStatisticsBreakdownsResidence[];
  sex?: PlaceStatisticsBreakdownsSex[];
}
