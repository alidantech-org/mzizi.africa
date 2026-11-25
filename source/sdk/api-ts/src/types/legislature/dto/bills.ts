import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A bill. Its titles are `identity.names`; its summaries are `legislature.summaries`. */
export interface LegislatureBills {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  institutionId: string;
  instrumentId?: string | null;
  kindTerm: string;
  sponsorId?: string | null;
  statusTerm: string;
  termId?: string | null;
  updatedAt: string;
  version: number;
}
