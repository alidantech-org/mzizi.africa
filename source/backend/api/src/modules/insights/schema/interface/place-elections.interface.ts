import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PlaceCrumb } from "#/modules/insights/schema/interface/place-crumb.interface.ts";
import type { PlaceElectionsElections } from "#/modules/insights/schema/interface/place-elections-elections.interface.ts";
import type { PlaceElectionsRegistrationTrend } from "#/modules/insights/schema/interface/place-elections-registration-trend.interface.ts";
import type { PlaceElectionsTurnoutTrend } from "#/modules/insights/schema/interface/place-elections-turnout-trend.interface.ts";

/** Place Elections */
export interface PlaceElections {
  elections: PlaceElectionsElections[];
  gaps: NonEmptyString500[];
  place: PlaceCrumb;
  registrationTrend: PlaceElectionsRegistrationTrend[];
  turnoutTrend: PlaceElectionsTurnoutTrend[];
}
