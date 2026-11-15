
import type { Description } from "#/modules/shared/description.type.ts";
import type { Flag } from "#/modules/shared/flag.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Named permission bundle with a policy version; protected roles cannot be edited away. */
export interface Roles {
  code: IdentityCode;
  createdAt: Instant;
  description?: Description | null;
  id: Id;
  managingInstitutionRefId?: Id | null;
  policyVersion: NonEmptyString255;
  protected: Flag;
  retiredAt?: Instant | null;
  title: NonEmptyString255;
}