import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** Who publishes; a publisher shares its organisation's identity (`official.entities`). */
export interface SourcePublishers {
  classTerm?: string | null;
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  kindTerm: string;
  updatedAt: string;
  version: number;
}
