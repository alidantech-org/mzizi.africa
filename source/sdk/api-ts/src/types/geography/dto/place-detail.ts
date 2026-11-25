import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";
import type { GeographyPlaceDetailNames } from "#sdk/types/geography/dto/place-detail-names.ts";
import type { GeographyPlaceDetailParents } from "#sdk/types/geography/dto/place-detail-parents.ts";

/** Place Detail */
export interface GeographyPlaceDetail {
  code: string;
  endedOn: string | null;
  establishedOn: string | null;
  featureId: string;
  fromYear: number | null;
  identityKind: SharedIdentityKind;
  kindTerm: string;
  names: GeographyPlaceDetailNames[];
  parents: GeographyPlaceDetailParents[];
  toYear: number | null;
}
