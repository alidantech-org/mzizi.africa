import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** Address Match */
export interface IdentityAddressMatch {
  addressId: string;
  canonicalId: string | null;
  code: string;
  identityId: string;
  kind: SharedIdentityKind;
  parentId: string | null;
  sectionTerm: string | null;
  toYear: number | null;
}
