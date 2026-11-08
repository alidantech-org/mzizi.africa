
import type { BidStatus } from "#/types/procurement/bid-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Tender } from "#/types/procurement/tender.interface.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Bid */
export interface Bid {
  amount: Amount;
  bidderEntityId: Id;
  createdAt: DateTime;
  currencyCode: CurrencyCode;
  evaluationNote?: Description | null;
  id: Id;
  isCompliant?: Flag | null;
  isCurrent: Flag;
  status: BidStatus;
  submittedOn: Date;
  tenderId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}