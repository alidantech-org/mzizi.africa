import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** The one identity of every place, natural or administrative. A country's feature shares the country's identity; parents and ranks are dated relationships, never columns here. */
export interface GeographyFeatures {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  endedOn?: string | null;
  establishedOn?: string | null;
  fromYear?: number | null;
  id: string;
  identityKind: SharedIdentityKind;
  kindTerm: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
