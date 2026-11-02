
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { AddressText } from "#/types/entities/address-text.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { LegalEntity } from "#/types/entities/legal-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Entity Location Public */
export interface EntityLocationPublic {
  addressText?: AddressText | null;
  createdAt: DateTime;
  entityId: Id;
  geoUnitId?: Id | null;
  id: Id;
  isCurrent: Flag;
  kindId?: Id | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}