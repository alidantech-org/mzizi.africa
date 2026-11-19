import type { InsightsPlaceCrumb } from "#sdk/types/insights/place-crumb.ts";
import type { InsightsPlaceElectionsElections } from "#sdk/types/insights/place-elections-elections.ts";
import type { InsightsPlaceElectionsRegistrationTrend } from "#sdk/types/insights/place-elections-registration-trend.ts";
import type { InsightsPlaceElectionsTurnoutTrend } from "#sdk/types/insights/place-elections-turnout-trend.ts";

/** Place Elections */
export interface InsightsPlaceElections {
  elections: InsightsPlaceElectionsElections[];
  gaps: string[];
  place: InsightsPlaceCrumb;
  registrationTrend: InsightsPlaceElectionsRegistrationTrend[];
  turnoutTrend: InsightsPlaceElectionsTurnoutTrend[];
}
