import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A public service. Its names and descriptions are `identity.names`. */
export interface CivicServices {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  featureId?: string | null;
  fromYear?: number | null;
  id: string;
  identityKind: SharedIdentityKind;
  institutionId?: string | null;
  kindTerm: string;
  providerId?: string | null;
  scopeId?: string | null;
  startsOn?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
