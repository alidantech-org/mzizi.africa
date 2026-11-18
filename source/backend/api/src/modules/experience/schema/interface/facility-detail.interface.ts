import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { FacilityRow } from "#/modules/experience/schema/interface/facility-row.interface.ts";
import type { HostedStation } from "#/modules/experience/schema/interface/hosted-station.interface.ts";
import type { PlaceRef } from "#/modules/experience/schema/interface/place-ref.interface.ts";

/** Facility Detail */
export interface FacilityDetail {
  chain: PlaceRef[];
  facility: FacilityRow;
  gaps: NonEmptyString500[];
  stations: HostedStation[];
}
