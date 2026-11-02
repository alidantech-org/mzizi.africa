
import type { MembershipBasis } from "#/types/website/membership-basis.enum.ts";
import type { MembershipRole } from "#/types/website/membership-role.enum.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Site } from "#/types/website/site.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Site Member Public */
export interface SiteMemberPublic {
  basis: MembershipBasis;
  createdAt: DateTime;
  familyId: Id;
  id: Id;
  methodId?: Id | null;
  role: MembershipRole;
  score?: Confidence | null;
  siteId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validTo?: Date | null;
  version: Version;
}