import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/** Source Entry */
export interface SourceEntry {
  artifactCount: NonNegativeInteger;
  citationCount: NonNegativeInteger;
  code: IdentityCode;
  name: Name;
  publisherName?: Name | null;
  sourceId: Id;
}
