import type { InstrumentEntry } from "#/modules/legal/schema/interface/instrument-entry.interface.ts";

/** Instrument Collection */
export interface InstrumentCollection {
  instruments: InstrumentEntry[];
}
