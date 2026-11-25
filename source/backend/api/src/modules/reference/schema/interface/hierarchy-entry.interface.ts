import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { HierarchyEntryLevels } from "#/modules/reference/schema/interface/hierarchy-entry-levels.interface.ts";
import type { HierarchyEntryNames } from "#/modules/reference/schema/interface/hierarchy-entry-names.interface.ts";

/** Hierarchy Entry */
export interface HierarchyEntry {
  code: IdentityCode;
  fromYear: Year | null;
  hierarchyId: Id;
  isRouting: Flag;
  kindTerm: Id;
  levels: HierarchyEntryLevels[];
  names: HierarchyEntryNames[];
  toYear: Year | null;
}
