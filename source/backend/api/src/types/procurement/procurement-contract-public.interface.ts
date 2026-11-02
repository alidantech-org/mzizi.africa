
import type { ContractStatus } from "#/types/procurement/contract-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Tender } from "#/types/procurement/tender.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Procurement Contract Public */
export interface ProcurementContractPublic {
  awardedEntityId: Id;
  awardedOn?: Date | null;
  code: BusinessCode;
  contractingOfficeId?: Id | null;
  contractingUnitId: Id;
  createdAt: DateTime;
  currencyCode: CurrencyCode;
  id: Id;
  isCurrent: Flag;
  status: ContractStatus;
  tenderId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  value: Amount;
  version: Version;
}