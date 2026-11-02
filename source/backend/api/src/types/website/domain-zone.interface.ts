
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Hostname } from "#/types/website/hostname.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Domain Zone */
export interface DomainZone {
  createdAt: DateTime;
  id: Id;
  operator?: LongText | null;
  parentSuffix?: Hostname | null;
  purpose?: LongText | null;
  secondLevelOpen?: Flag | null;
  suffix: Hostname;
  updatedAt: DateTime;
  version: Version;
}