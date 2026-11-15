
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Base for operational records with a unique identity code and creation time. */
export interface CodedCreated {
  code: IdentityCode;
  createdAt: Instant;
  id: Id;
}