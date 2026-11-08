
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { LegalProvision } from "#/types/legal/legal-provision.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Legal Authority Link Public */
export interface LegalAuthorityLinkPublic {
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  note?: Description | null;
  provisionId: Id;
  targetId: Id;
  targetKind: TargetKind;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}