import type { LegalInstrumentEntry } from "#sdk/types/legal/dto/instrument-entry.ts";

/** Instrument Collection */
export interface LegalInstrumentCollection {
  instruments: LegalInstrumentEntry[];
}
