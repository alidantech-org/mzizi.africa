import type { LedgerManifesto } from "#sdk/types/ledger/manifesto.ts";

/** Manifesto List */
export interface LedgerManifestoList {
  gaps: string[];
  manifestos: LedgerManifesto[];
}
