import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** Which kinds of named thing a scheme may classify. */
export interface VocabularyScopes {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  schemeId: string;
}
