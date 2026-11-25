import type { FinanceFindingEntry } from "#sdk/types/finance/dto/finding-entry.ts";

/** Finding Collection */
export interface FinanceFindingCollection {
  findings: FinanceFindingEntry[];
}
