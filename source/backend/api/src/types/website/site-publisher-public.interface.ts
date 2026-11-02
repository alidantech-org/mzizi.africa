
import type { SitePublisherRole } from "#/types/website/site-publisher-role.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Site } from "#/types/website/site.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Site Publisher Public */
export interface SitePublisherPublic {
  createdAt: DateTime;
  id: Id;
  publisherId: Id;
  role: SitePublisherRole;
  siteId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validTo?: Date | null;
  version: Version;
}