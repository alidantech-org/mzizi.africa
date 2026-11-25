import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** Display names of named things in every language, with kind, script and valid period. Where a name came from is recorded in `source.evidence`. */
export interface IdentityNames {
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  id: string;
  identityId: string;
  identityKind: SharedIdentityKind;
  isDefault: boolean;
  kindTerm: string;
  languageId: string;
  scriptTerm?: string | null;
  text: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
