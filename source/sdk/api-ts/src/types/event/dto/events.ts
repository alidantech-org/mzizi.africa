import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A planned or recurring civic happening (Madaraka Day, budget reading). Its names are `identity.names`. */
export interface EventEvents {
  basisProvisionId?: string | null;
  calendarId?: string | null;
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  featureId?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  kindTerm: string;
  levelId?: string | null;
  organiserId?: string | null;
  updatedAt: string;
  version: number;
}
