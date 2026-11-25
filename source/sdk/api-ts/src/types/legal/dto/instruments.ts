import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A legal instrument (the Constitution of Kenya 2010, an Act). Its titles are `identity.names`. */
export interface LegalInstruments {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  enactedOn?: string | null;
  fromYear?: number | null;
  id: string;
  identityKind: SharedIdentityKind;
  issuerId?: string | null;
  jurisdictionId?: string | null;
  kindTerm: string;
  publishedOn?: string | null;
  statusTerm?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
