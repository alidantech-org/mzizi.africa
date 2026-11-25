import type { HistoryEntry } from "#/modules/history/schema/interface/history-entry.interface.ts";

/** History Collection */
export interface HistoryCollection {
  occurrences: HistoryEntry[];
}
