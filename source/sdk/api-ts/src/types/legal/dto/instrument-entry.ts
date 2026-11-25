import type { LegalInstrumentEntryNames } from "#sdk/types/legal/dto/instrument-entry-names.ts";

/** Instrument Entry */
export interface LegalInstrumentEntry {
  code: string;
  enactedOn: string | null;
  fromYear: number | null;
  instrumentId: string;
  kindTerm: string;
  names: LegalInstrumentEntryNames[];
  statusTerm: string | null;
}
