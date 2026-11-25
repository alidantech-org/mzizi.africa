import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A procedure law sets out; its explanation is a definition name or a media article. */
export interface GovernanceProcedures {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  kindTerm: string;
  provisionId?: string | null;
  updatedAt: string;
  version: number;
}
