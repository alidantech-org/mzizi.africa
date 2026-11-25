import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Identity Detail Identifiers */
export interface IdentityDetailIdentifiers {
  namespace: NonEmptyString255 | null;
  schemeTerm: Id;
  value: NonEmptyString500;
}
