import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** The anchor of every named thing (country, feature, person, organisation, office, law, event). Extending tables use this id as their own primary key; it never carries display text. */
export interface IdentityIdentities {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  kind: SharedIdentityKind;
  updatedAt: string;
  version: number;
}
