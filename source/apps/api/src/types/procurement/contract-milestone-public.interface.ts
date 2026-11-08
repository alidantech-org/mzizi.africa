
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { ProcurementContract } from "#/types/procurement/procurement-contract.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Contract Milestone Public */
export interface ContractMilestonePublic {
  amount?: Amount | null;
  completedOn?: Date | null;
  contractId: Id;
  createdAt: DateTime;
  currencyCode?: CurrencyCode | null;
  dueOn?: Date | null;
  id: Id;
  isCurrent: Flag;
  title: Name;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}