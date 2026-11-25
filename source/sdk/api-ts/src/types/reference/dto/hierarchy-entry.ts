import type { ReferenceHierarchyEntryLevels } from "#sdk/types/reference/dto/hierarchy-entry-levels.ts";
import type { ReferenceHierarchyEntryNames } from "#sdk/types/reference/dto/hierarchy-entry-names.ts";

/** Hierarchy Entry */
export interface ReferenceHierarchyEntry {
  code: string;
  fromYear: number | null;
  hierarchyId: string;
  isRouting: boolean;
  kindTerm: string;
  levels: ReferenceHierarchyEntryLevels[];
  names: ReferenceHierarchyEntryNames[];
  toYear: number | null;
}
