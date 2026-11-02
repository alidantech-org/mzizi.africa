
import type { ActorRole } from "#/types/shared/actor-role.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Account } from "#/types/identity/account.interface.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Account Grant */
export interface AccountGrant {
  accountId: Id;
  createdAt: DateTime;
  grantedBy?: Id | null;
  id: Id;
  isCurrent: Flag;
  jurisdictionId?: Id | null;
  role: ActorRole;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}