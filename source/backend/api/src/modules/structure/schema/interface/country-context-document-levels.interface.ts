import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/** Country Context Document Levels */
export interface CountryContextDocumentLevels {
  depth: NonNegativeInteger;
  id: Id;
  kind: Name;
  kindCode: IdentityCode;
  rootFeatureId: Id | null;
  routing: Flag;
}
