
import type { LedgerEntryPublic } from "#/types/finance/ledger-entry-public.interface.ts";

/** Ledger Entry Response */
export interface LedgerEntryResponse {
  entry: LedgerEntryPublic;
}