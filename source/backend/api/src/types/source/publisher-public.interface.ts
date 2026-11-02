
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Publisher Public */
export interface PublisherPublic {
  code: BusinessCode;
  createdAt: DateTime;
  id: Id;
  jurisdictionId?: Id | null;
  kindId: Id;
  name: Name;
  reliability?: Confidence | null;
  updatedAt: DateTime;
  version: Version;
  websiteUrl?: Url | null;
}