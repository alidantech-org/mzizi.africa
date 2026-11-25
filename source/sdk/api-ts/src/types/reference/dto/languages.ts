import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** The language registry. Every text in the database points here; `und`, `mul` and `zxx` say what a missing language cannot, and a missing language never means English. */
export interface ReferenceLanguages {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  directionTerm?: string | null;
  familyTerm?: string | null;
  glottocode?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  iso6391?: string | null;
  iso6392?: string | null;
  iso6393?: string | null;
  kindTerm: string;
  parentId?: string | null;
  scriptTerm?: string | null;
  updatedAt: string;
  version: number;
  vitalityTerm?: string | null;
}
