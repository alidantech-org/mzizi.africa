
import type { Retention } from "#/modules/filesystem/retention.enum.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Stable logical file identity; equal content hashes may belong to different files. */
export interface Files {
  code: IdentityCode;
  createdAt: Instant;
  currentVersionId?: Id | null;
  deletedAt?: Instant | null;
  folderId: Id;
  id: Id;
  name: Name;
  retention: Retention;
  updatedAt: Instant;
  version: PositiveInteger;
}