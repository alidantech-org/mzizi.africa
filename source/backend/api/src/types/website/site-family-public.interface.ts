
import type { FamilyKind } from "#/types/website/family-kind.enum.ts";
import type { FamilyStatus } from "#/types/website/family-status.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Site Family Public */
export interface SiteFamilyPublic {
  code: BusinessCode;
  createdAt: DateTime;
  description?: Description | null;
  id: Id;
  jurisdictionId?: Id | null;
  kind: FamilyKind;
  name: Name;
  status: FamilyStatus;
  subjectKindId?: Id | null;
  updatedAt: DateTime;
  version: Version;
}