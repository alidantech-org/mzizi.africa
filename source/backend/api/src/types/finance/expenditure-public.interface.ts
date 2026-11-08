
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Budget } from "#/types/finance/budget.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Expenditure Public */
export interface ExpenditurePublic {
  amount: Amount;
  approverPersonId?: Id | null;
  budgetId: Id;
  contractId?: Id | null;
  createdAt: DateTime;
  currencyCode: CurrencyCode;
  id: Id;
  isCurrent: Flag;
  stageId: Id;
  stageOrder: Count;
  unitId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}