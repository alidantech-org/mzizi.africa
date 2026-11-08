
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { IdentifierValue } from "#/types/entities/identifier-value.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { LegalEntity } from "#/types/entities/legal-entity.interface.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Entity Identifier */
export interface EntityIdentifier {
  createdAt: DateTime;
  entityId: Id;
  id: Id;
  isCurrent: Flag;
  issuingAuthorityId?: Id | null;
  schemeId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  value: IdentifierValue;
  version: Version;
}