
import type { BudgetKind } from "#/types/finance/budget-kind.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { ProgramCode } from "#/types/finance/program-code.type.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BudgetaryUnit } from "#/types/finance/budgetary-unit.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Budget Public */
export interface BudgetPublic {
  approvedAmount: Amount;
  createdAt: DateTime;
  currencyCode: CurrencyCode;
  fiscalYearId: Id;
  id: Id;
  isCurrent: Flag;
  kind: BudgetKind;
  legalBasisId?: Id | null;
  programCode?: ProgramCode | null;
  unitId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}