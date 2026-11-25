import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";
import type { GeographyPlaceEntryNames } from "#sdk/types/geography/dto/place-entry-names.ts";

/** Place Entry */
export interface GeographyPlaceEntry {
  code: string;
  featureId: string;
  fromYear: number | null;
  identityKind: SharedIdentityKind;
  kindTerm: string;
  names: GeographyPlaceEntryNames[];
  toYear: number | null;
}
