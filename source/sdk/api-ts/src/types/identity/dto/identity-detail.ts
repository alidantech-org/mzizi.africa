import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";
import type { IdentityIdentityDetailIdentifiers } from "#sdk/types/identity/dto/identity-detail-identifiers.ts";
import type { IdentityIdentityDetailNames } from "#sdk/types/identity/dto/identity-detail-names.ts";

/** Identity Detail */
export interface IdentityIdentityDetail {
  code: string;
  identifiers: IdentityIdentityDetailIdentifiers[];
  identityId: string;
  kind: SharedIdentityKind;
  names: IdentityIdentityDetailNames[];
}
