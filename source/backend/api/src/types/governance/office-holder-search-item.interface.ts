
import type { HolderStatus } from "#/types/governance/holder-status.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Office Holder Search Item */
export interface OfficeHolderSearchItem {
  holderId: Id;
  institutionId: Id;
  institutionName: Name;
  isCurrent: Flag;
  officeId: Id;
  officeName: Name;
  partyName?: Name | null;
  personId: Id;
  personName: Name;
  placeName?: Name | null;
  status: HolderStatus;
  validFrom?: Date | null;
  validTo?: Date | null;
}