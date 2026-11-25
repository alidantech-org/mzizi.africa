import type { FinanceAppropriationEntry } from "#sdk/types/finance/dto/appropriation-entry.ts";

/** Appropriation Collection */
export interface FinanceAppropriationCollection {
  appropriations: FinanceAppropriationEntry[];
}
