import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** Name Match */
export interface IdentityNameMatch {
  code: string;
  identityId: string;
  isDefault: boolean;
  kind: SharedIdentityKind;
  languageCode: string;
  text: string;
}
