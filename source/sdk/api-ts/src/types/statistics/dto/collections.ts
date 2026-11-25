import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** The programme that produced figures (census 2019, KDHS 2022, WDI). */
export interface StatisticsCollections {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  id: string;
  identityKind: SharedIdentityKind;
  kindTerm: string;
  stewardId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
