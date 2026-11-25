import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";
import type { HistoryHistoryEntryNames } from "#sdk/types/history/dto/history-entry-names.ts";

/** History Entry */
export interface HistoryHistoryEntry {
  code: string;
  fromYear: number | null;
  kindTerm: string;
  names: HistoryHistoryEntryNames[];
  occurrenceId: string;
  precision: SharedDatePrecision;
  startsOn: string | null;
  toYear: number | null;
}
