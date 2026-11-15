
import type { Description } from "#/modules/shared/description.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/non-empty-string1000.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Accepted rights and credit statement tied to exact content and publisher. */
export interface Attributions {
  assessedAt: Instant;
  assessorSnapshot: JsonText;
  createdAt: Instant;
  credit: NonEmptyString1000;
  deletedAt?: Instant | null;
  fileVersionId: Id;
  id: Id;
  licenseValueId?: Id | null;
  publisherId: Id;
  rightsStatement: Description;
  updatedAt: Instant;
  version: PositiveInteger;
}