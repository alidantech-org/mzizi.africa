
import type { ProvisionKind } from "#/types/legal/provision-kind.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Citation } from "#/types/legal/citation.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { LegalInstrument } from "#/types/legal/legal-instrument.interface.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Legal Provision */
export interface LegalProvision {
  citation: Citation;
  code: BusinessCode;
  content?: LongText | null;
  createdAt: DateTime;
  heading?: Name | null;
  id: Id;
  instrumentId: Id;
  isCurrent: Flag;
  kind: ProvisionKind;
  parentId?: Id | null;
  previousVersionId?: Id | null;
  sortOrder: Count;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}