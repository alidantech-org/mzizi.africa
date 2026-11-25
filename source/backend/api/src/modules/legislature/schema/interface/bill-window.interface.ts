import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Bill Window */
export interface BillWindow {
  institutionId: Id;
  limit?: Integer;
  offset?: Integer;
  statusTerm?: Id;
}
