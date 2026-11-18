import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/** Election Input */
export interface ElectionInput {
  contestKind?: NonEmptyString100;
  electionId: Id;
  parentFeatureId?: Id;
}
