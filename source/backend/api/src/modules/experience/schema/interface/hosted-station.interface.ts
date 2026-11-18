import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/** Hosted Station */
export interface HostedStation {
  ballotsCast?: NonNegativeInteger | null;
  electionCode: NonEmptyString255;
  electionYear: Integer;
  registeredVoters?: NonNegativeInteger | null;
  stationName: Name;
  statusLabel: Name;
  streamCount?: NonNegativeInteger | null;
}
