import type { ReferenceHierarchyEntryLevelsNames } from "#sdk/types/reference/dto/hierarchy-entry-levels-names.ts";

/** Hierarchy Entry Levels */
export interface ReferenceHierarchyEntryLevels {
  code: string;
  depth: number;
  kindTerm: string;
  levelId: string;
  names: ReferenceHierarchyEntryLevelsNames[];
}
