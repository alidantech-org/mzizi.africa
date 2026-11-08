
import type { FundRestriction } from "#/types/finance/fund-restriction.enum.ts";
import type { TransferStatus } from "#/types/finance/transfer-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BudgetaryUnit } from "#/types/finance/budgetary-unit.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Transfer Public */
export interface TransferPublic {
  amount: Amount;
  createdAt: DateTime;
  currencyCode: CurrencyCode;
  fiscalYearId: Id;
  fromUnitId: Id;
  id: Id;
  isCurrent: Flag;
  legalBasisId?: Id | null;
  restriction: FundRestriction;
  status: TransferStatus;
  toUnitId: Id;
  transferTypeId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}