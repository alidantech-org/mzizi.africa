import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { ElectionDetailContests } from "#/modules/election/schema/interface/election-detail-contests.interface.ts";
import type { ElectionDetailNames } from "#/modules/election/schema/interface/election-detail-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Election Detail */
export interface ElectionDetail {
  code: IdentityCode;
  contests: ElectionDetailContests[];
  electionId: Id;
  fromYear: Year;
  heldOn: CalendarDate | null;
  kindTerm: Id;
  names: ElectionDetailNames[];
  statusTerm: Id;
}
