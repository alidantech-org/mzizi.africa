import type { Depth } from "#/modules/reference/schema/type/depth.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { HierarchyEntryLevelsNames } from "#/modules/reference/schema/interface/hierarchy-entry-levels-names.interface.ts";

/** Hierarchy Entry Levels */
export interface HierarchyEntryLevels {
  code: IdentityCode;
  depth: Depth;
  kindTerm: Id;
  levelId: Id;
  names: HierarchyEntryLevelsNames[];
}
