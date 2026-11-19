import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PlaceCivicClasses } from "#/modules/insights/schema/interface/place-civic-classes.interface.ts";
import type { PlaceCivicFund } from "#/modules/insights/schema/interface/place-civic-fund.interface.ts";
import type { PlaceCivicInfrastructure } from "#/modules/insights/schema/interface/place-civic-infrastructure.interface.ts";
import type { PlaceCivicLeadership } from "#/modules/insights/schema/interface/place-civic-leadership.interface.ts";
import type { PlaceCivicProjects } from "#/modules/insights/schema/interface/place-civic-projects.interface.ts";
import type { PlaceCivicYears } from "#/modules/insights/schema/interface/place-civic-years.interface.ts";
import type { PlaceCrumb } from "#/modules/insights/schema/interface/place-crumb.interface.ts";

/** Place Civic */
export interface PlaceCivic {
  chain: PlaceCrumb[];
  classes: PlaceCivicClasses[];
  fund: PlaceCivicFund;
  gaps: NonEmptyString500[];
  infrastructure: PlaceCivicInfrastructure;
  leadership: PlaceCivicLeadership[];
  place: PlaceCrumb;
  projects: PlaceCivicProjects[];
  years: PlaceCivicYears[];
}
