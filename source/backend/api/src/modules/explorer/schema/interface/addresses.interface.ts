import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { AddressPlace } from "#/modules/explorer/schema/interface/address-place.interface.ts";

/** Addresses */
export interface Addresses {
  gaps: NonEmptyString500[];
  places: AddressPlace[];
}
