import type { InsightsPlaceStatisticsBreakdownsAge } from "#sdk/types/insights/place-statistics-breakdowns-age.ts";
import type { InsightsPlaceStatisticsBreakdownsCommunity } from "#sdk/types/insights/place-statistics-breakdowns-community.ts";
import type { InsightsPlaceStatisticsBreakdownsLanguage } from "#sdk/types/insights/place-statistics-breakdowns-language.ts";
import type { InsightsPlaceStatisticsBreakdownsResidence } from "#sdk/types/insights/place-statistics-breakdowns-residence.ts";
import type { InsightsPlaceStatisticsBreakdownsSex } from "#sdk/types/insights/place-statistics-breakdowns-sex.ts";

/** Place Statistics Breakdowns */
export interface InsightsPlaceStatisticsBreakdowns {
  age?: InsightsPlaceStatisticsBreakdownsAge[];
  community?: InsightsPlaceStatisticsBreakdownsCommunity[];
  language?: InsightsPlaceStatisticsBreakdownsLanguage[];
  residence?: InsightsPlaceStatisticsBreakdownsResidence[];
  sex?: InsightsPlaceStatisticsBreakdownsSex[];
}
