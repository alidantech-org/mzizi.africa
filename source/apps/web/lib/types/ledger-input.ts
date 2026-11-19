import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Ledger Input */
export interface LedgerInput {
  limit?: number;
}

/** Field metadata for forms and results. */
export const LedgerInputFields: readonly FieldMeta[] = [
  { name: "limit", label: "Limit", kind: "number", required: false },
];
