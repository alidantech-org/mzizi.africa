
import type { SiteKind } from "#/types/website/site-kind.enum.ts";
import type { SiteStatus } from "#/types/website/site-status.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Site */
export interface Site {
  code: BusinessCode;
  createdAt: DateTime;
  description?: Description | null;
  firstSeenAt?: DateTime | null;
  id: Id;
  jurisdictionId?: Id | null;
  kind: SiteKind;
  lastSeenAt?: DateTime | null;
  name: Name;
  status: SiteStatus;
  updatedAt: DateTime;
  version: Version;
}