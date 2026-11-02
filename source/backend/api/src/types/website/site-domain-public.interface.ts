
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { DomainRole } from "#/types/website/domain-role.enum.ts";
import type { UrlScheme } from "#/types/website/url-scheme.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Hostname } from "#/types/website/hostname.type.ts";
import type { Site } from "#/types/website/site.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Site Domain Public */
export interface SiteDomainPublic {
  createdAt: DateTime;
  hostname: Hostname;
  id: Id;
  observedAt?: DateTime | null;
  role: DomainRole;
  scheme: UrlScheme;
  siteId: Id;
  updatedAt: DateTime;
  validFrom: Date;
  validFromPrecision: DatePrecision;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}