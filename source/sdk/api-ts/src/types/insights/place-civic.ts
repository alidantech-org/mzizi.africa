import type { InsightsPlaceCivicClasses } from "#sdk/types/insights/place-civic-classes.ts";
import type { InsightsPlaceCivicFund } from "#sdk/types/insights/place-civic-fund.ts";
import type { InsightsPlaceCivicInfrastructure } from "#sdk/types/insights/place-civic-infrastructure.ts";
import type { InsightsPlaceCivicLeadership } from "#sdk/types/insights/place-civic-leadership.ts";
import type { InsightsPlaceCivicProjects } from "#sdk/types/insights/place-civic-projects.ts";
import type { InsightsPlaceCivicYears } from "#sdk/types/insights/place-civic-years.ts";
import type { InsightsPlaceCrumb } from "#sdk/types/insights/place-crumb.ts";

/** Place Civic */
export interface InsightsPlaceCivic {
  chain: InsightsPlaceCrumb[];
  classes: InsightsPlaceCivicClasses[];
  fund: InsightsPlaceCivicFund;
  gaps: string[];
  infrastructure: InsightsPlaceCivicInfrastructure;
  leadership: InsightsPlaceCivicLeadership[];
  place: InsightsPlaceCrumb;
  projects: InsightsPlaceCivicProjects[];
  years: InsightsPlaceCivicYears[];
}
