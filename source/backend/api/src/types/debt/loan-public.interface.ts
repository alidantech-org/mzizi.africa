
import type { LoanStatus } from "#/types/debt/loan-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import type { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { TermMonths } from "#/types/debt/term-months.type.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Rate } from "#/types/shared/rate.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BudgetaryUnit } from "#/types/finance/budgetary-unit.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Loan Public */
export interface LoanPublic {
  artifactChecksum?: Checksum | null;
  artifactId?: Id | null;
  borrowerUnitId: Id;
  code: BusinessCode;
  confidence?: Confidence | null;
  createdAt: DateTime;
  currencyCode: CurrencyCode;
  id: Id;
  interestRate?: Rate | null;
  isCurrent: Flag;
  legalBasisId?: Id | null;
  lenderEntityId?: Id | null;
  licence?: Name | null;
  method: ProvenanceMethod;
  principalAmount: Amount;
  retrievedAt?: DateTime | null;
  sourceName: Name;
  sourceReference?: Description | null;
  sourceUrl?: Url | null;
  status: LoanStatus;
  termMonths?: TermMonths | null;
  toolOrModel?: Name | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  verificationState: VerificationState;
  version: Version;
}