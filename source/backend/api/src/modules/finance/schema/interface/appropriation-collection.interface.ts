import type { AppropriationEntry } from "#/modules/finance/schema/interface/appropriation-entry.interface.ts";

/** Appropriation Collection */
export interface AppropriationCollection {
  appropriations: AppropriationEntry[];
}
