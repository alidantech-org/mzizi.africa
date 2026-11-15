
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/** Base for operational records with a unique identity code and creation time. */
export interface CodedCreated {
  code: IdentityCode;
  createdAt: Instant;
  id: Id;
}