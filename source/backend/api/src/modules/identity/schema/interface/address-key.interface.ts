import type { AddressSegment } from "#/modules/identity/schema/type/address-segment.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Address Key */
export interface AddressKey {
  countryId?: Id;
  limit?: Integer;
  offset?: Integer;
  segment: AddressSegment;
}
