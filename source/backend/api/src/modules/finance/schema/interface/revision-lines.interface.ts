import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Revision Lines */
export interface RevisionLines {
  limit?: Integer;
  offset?: Integer;
  revisionId: Id;
}
