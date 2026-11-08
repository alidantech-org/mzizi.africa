
import type { InstrumentStatus } from "#/types/legal/instrument-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Legal Instrument */
export interface LegalInstrument {
  code: BusinessCode;
  contentHash?: Checksum | null;
  createdAt: DateTime;
  documentUrl?: Url | null;
  id: Id;
  isCurrent: Flag;
  issuingInstitutionId?: Id | null;
  jurisdictionId: Id;
  kindId: Id;
  status: InstrumentStatus;
  summary?: Description | null;
  title: Name;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}