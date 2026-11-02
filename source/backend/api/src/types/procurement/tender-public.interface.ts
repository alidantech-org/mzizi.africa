
import type { TenderStatus } from "#/types/procurement/tender-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Tender Public */
export interface TenderPublic {
  budgetId?: Id | null;
  closesOn?: Date | null;
  code: BusinessCode;
  createdAt: DateTime;
  currencyCode: CurrencyCode;
  estimatedValue?: Amount | null;
  id: Id;
  isCurrent: Flag;
  issuingUnitId: Id;
  kindId: Id;
  legalBasisId?: Id | null;
  methodId: Id;
  procuringOfficeId?: Id | null;
  publishedOn?: Date | null;
  status: TenderStatus;
  title: Name;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}