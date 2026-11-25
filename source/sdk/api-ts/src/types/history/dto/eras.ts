import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A named period, possibly inside another. */
export interface HistoryEras {
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  id: string;
  identityKind: SharedIdentityKind;
  kindTerm: string;
  parentId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
