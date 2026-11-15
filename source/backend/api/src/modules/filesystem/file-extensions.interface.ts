
import type { Description } from "#/modules/shared/description.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Technical filename suffix and media-type hint; never a semantic document classification. */
export interface FileExtensions {
  code: IdentityCode;
  contentType: NonEmptyString255;
  createdAt: Instant;
  deletedAt?: Instant | null;
  description?: Description | null;
  extension: NonEmptyString100;
  id: Id;
  updatedAt: Instant;
  version: PositiveInteger;
}