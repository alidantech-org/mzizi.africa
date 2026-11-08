
import type { LoanStatus } from "#/types/debt/loan-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { TermMonths } from "#/types/debt/term-months.type.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Rate } from "#/types/shared/rate.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Loan Public */
export interface LoanPublic {
  borrowerUnitId: Id;
  code: BusinessCode;
  createdAt: DateTime;
  currencyCode: CurrencyCode;
  id: Id;
  interestRate?: Rate | null;
  isCurrent: Flag;
  legalBasisId?: Id | null;
  lenderEntityId?: Id | null;
  principalAmount: Amount;
  status: LoanStatus;
  termMonths?: TermMonths | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}