
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { OwnershipPercentage } from "#/types/entities/ownership-percentage.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { LegalEntity } from "#/types/entities/legal-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Entity Ownership Public */
export interface EntityOwnershipPublic {
  createdAt: DateTime;
  entityId: Id;
  id: Id;
  isCurrent: Flag;
  ownerEntityId?: Id | null;
  ownerPersonId?: Id | null;
  percentage?: OwnershipPercentage | null;
  position?: Label | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}