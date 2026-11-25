import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A rank of one hierarchy (Kenya 2013: county, sub-county, ward). */
export interface ReferenceLevels {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  depth: number;
  hierarchyId: string;
  id: string;
  identityKind: SharedIdentityKind;
  kindTerm: string;
  updatedAt: string;
  version: number;
}
