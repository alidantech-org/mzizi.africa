import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** An IANA time zone. */
export interface ReferenceTimezones {
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  ianaName: string;
  id: string;
  identityKind: SharedIdentityKind;
  updatedAt: string;
  version: number;
}
