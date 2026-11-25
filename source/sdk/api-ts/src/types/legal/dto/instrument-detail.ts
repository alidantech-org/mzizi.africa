import type { LegalInstrumentDetailEditions } from "#sdk/types/legal/dto/instrument-detail-editions.ts";
import type { LegalInstrumentDetailNames } from "#sdk/types/legal/dto/instrument-detail-names.ts";

/** Instrument Detail */
export interface LegalInstrumentDetail {
  code: string;
  editions: LegalInstrumentDetailEditions[];
  enactedOn: string | null;
  instrumentId: string;
  issuerId: string | null;
  kindTerm: string;
  names: LegalInstrumentDetailNames[];
  publishedOn: string | null;
  statusTerm: string | null;
}
