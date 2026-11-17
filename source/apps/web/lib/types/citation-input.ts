import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Citation Input */
export interface CitationInput {
  citationId: string;
}

/** Field metadata for forms and results. */
export const CitationInputFields: readonly FieldMeta[] = [
  { name: "citationId", label: "Citation Id", kind: "string", required: true },
];
