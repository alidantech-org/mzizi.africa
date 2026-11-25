import type { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { IdentityDetailIdentifiers } from "#/modules/identity/schema/interface/identity-detail-identifiers.interface.ts";
import type { IdentityDetailNames } from "#/modules/identity/schema/interface/identity-detail-names.interface.ts";

/** Identity Detail */
export interface IdentityDetail {
  code: IdentityCode;
  identifiers: IdentityDetailIdentifiers[];
  identityId: Id;
  kind: IdentityKind;
  names: IdentityDetailNames[];
}
