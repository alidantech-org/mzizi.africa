import type { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/** Address Match */
export interface AddressMatch {
  addressId: Id;
  canonicalId: Id | null;
  code: IdentityCode;
  identityId: Id;
  kind: IdentityKind;
  parentId: Id | null;
  sectionTerm: Id | null;
  toYear: Year | null;
}
