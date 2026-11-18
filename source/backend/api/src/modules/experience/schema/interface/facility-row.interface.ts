import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { Capacity } from "#/modules/experience/schema/interface/capacity.interface.ts";

/** Facility Row */
export interface FacilityRow {
  capacity: Capacity[];
  classCode: NonEmptyString100;
  classLabel: Name;
  code: NonEmptyString255;
  domainCode: NonEmptyString100;
  domainLabel: Name;
  featureId: Id;
  latitude?: Number | null;
  longitude?: Number | null;
  name: Name;
  operator?: Name | null;
  ownershipLabel?: Name | null;
  placeName?: Name | null;
  placePath?: NonEmptyString1000 | null;
  statusLabel: Name;
}
