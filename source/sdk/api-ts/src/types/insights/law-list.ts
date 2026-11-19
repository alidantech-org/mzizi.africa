import type { InsightsLawInstrument } from "#sdk/types/insights/law-instrument.ts";

/** Law List */
export interface InsightsLawList {
  gaps: string[];
  instruments: InsightsLawInstrument[];
}
