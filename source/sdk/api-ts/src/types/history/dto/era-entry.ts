import type { HistoryEraEntryNames } from "#sdk/types/history/dto/era-entry-names.ts";

/** Era Entry */
export interface HistoryEraEntry {
  code: string;
  eraId: string;
  fromYear: number | null;
  kindTerm: string;
  names: HistoryEraEntryNames[];
  parentId: string | null;
  toYear: number | null;
}
