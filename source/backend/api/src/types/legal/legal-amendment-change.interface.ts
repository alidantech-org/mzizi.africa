
import type { AmendmentChangeKind } from "#/types/legal/amendment-change-kind.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { LegalAmendment } from "#/types/legal/legal-amendment.interface.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Legal Amendment Change */
export interface LegalAmendmentChange {
  amendmentId: Id;
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  kind: AmendmentChangeKind;
  newText?: LongText | null;
  previousText?: LongText | null;
  provisionId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}