import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Institution Window */
export interface InstitutionWindow {
  armTerm?: Id;
  countryId: Id;
  limit?: Integer;
  offset?: Integer;
}
