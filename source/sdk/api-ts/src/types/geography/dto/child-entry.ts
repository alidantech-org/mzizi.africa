import type { GeographyChildEntryNames } from "#sdk/types/geography/dto/child-entry-names.ts";

/** Child Entry */
export interface GeographyChildEntry {
  code: string;
  featureId: string;
  hierarchyId: string | null;
  kindTerm: string;
  levelId: string | null;
  names: GeographyChildEntryNames[];
}
