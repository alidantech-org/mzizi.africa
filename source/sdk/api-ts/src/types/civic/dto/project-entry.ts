import type { CivicProjectEntryNames } from "#sdk/types/civic/dto/project-entry-names.ts";

/** Project Entry */
export interface CivicProjectEntry {
  code: string;
  fromYear: number | null;
  names: CivicProjectEntryNames[];
  projectId: string;
  siteKindTerm: string;
  statusTerm: string;
  toYear: number | null;
}
