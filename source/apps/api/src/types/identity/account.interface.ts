
import type { AccountStatus } from "#/types/identity/account-status.enum.ts";
import type { Issuer } from "#/types/identity/issuer.type.ts";
import type { Subject } from "#/types/identity/subject.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Account */
export interface Account {
  createdAt: DateTime;
  id: Id;
  issuer: Issuer;
  lastSeenAt?: DateTime | null;
  personId?: Id | null;
  status: AccountStatus;
  subject: Subject;
  updatedAt: DateTime;
  version: Version;
}