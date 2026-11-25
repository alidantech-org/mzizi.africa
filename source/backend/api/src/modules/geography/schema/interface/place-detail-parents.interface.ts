import type { Depth } from "#/modules/reference/schema/type/depth.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/** Place Detail Parents */
export interface PlaceDetailParents {
  depth: Depth | null;
  fromYear: Year | null;
  hierarchyId: Id | null;
  kindTerm: Id;
  levelId: Id | null;
  parentCode: IdentityCode;
  parentId: Id;
  toYear: Year | null;
}
