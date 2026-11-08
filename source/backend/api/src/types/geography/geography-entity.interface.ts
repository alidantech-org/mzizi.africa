
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Geography Entity */
export interface GeographyEntity {
  boundaryLicense?: Name | null;
  boundaryRetrievedAt?: DateTime | null;
  boundarySource?: Name | null;
  boundarySourceReference?: Description | null;
  boundaryVerified: Flag;
  boundaryVersion?: Version | null;
  boundaryYear?: Version | null;
  code: BusinessCode;
  displayName: Name;
  id: Id;
  level: Name;
  name: Name;
  parentId?: Id | null;
  parentName?: Name | null;
  validFrom?: Date | null;
  validTo?: Date | null;
}