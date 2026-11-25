import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Institution Findings */
export interface InstitutionFindings {
  institutionId: Id;
  limit?: Integer;
  offset?: Integer;
}
