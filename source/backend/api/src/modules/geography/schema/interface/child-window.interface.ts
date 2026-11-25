import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Child Window */
export interface ChildWindow {
  hierarchyId?: Id;
  levelId?: Id;
  limit?: Integer;
  offset?: Integer;
  parentId: Id;
}
