import type { LedgerManifesto } from "#sdk/types/ledger/dto/manifesto.ts";

/** Manifesto List */
export interface LedgerManifestoList {
  gaps: string[];
  manifestos: LedgerManifesto[];
}
