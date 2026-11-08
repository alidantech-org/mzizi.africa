
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Base Entity */
export interface BaseEntity {
  createdAt: DateTime;
  id: Id;
  updatedAt: DateTime;
  version: Version;
}