import type { FindingEntry } from "#/modules/finance/schema/interface/finding-entry.interface.ts";

/** Finding Collection */
export interface FindingCollection {
  findings: FindingEntry[];
}
