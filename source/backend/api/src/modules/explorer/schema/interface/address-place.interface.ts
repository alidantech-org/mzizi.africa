import type { Path } from "#/modules/explorer/schema/type/path.type.ts";
import type { Place } from "#/modules/explorer/schema/interface/place.interface.ts";

/** Address Place */
export interface AddressPlace {
  address: Path;
  place?: Place | null;
}
