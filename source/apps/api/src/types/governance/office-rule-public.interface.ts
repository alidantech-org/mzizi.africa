
import type { RuleKind } from "#/types/governance/rule-kind.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { RuleValue } from "#/types/governance/rule-value.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Office } from "#/types/governance/office.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Office Rule Public */
export interface OfficeRulePublic {
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  kind: RuleKind;
  legalBasisId?: Id | null;
  numericValue?: RuleValue | null;
  officeId: Id;
  textValue?: Description | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}