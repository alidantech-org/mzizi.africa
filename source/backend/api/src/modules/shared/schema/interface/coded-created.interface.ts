
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Base for operational records with a unique identity code and creation time. */
export interface CodedCreated {
  code: IdentityCode;
  createdAt: Instant;
  id: Id;
}