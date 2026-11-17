import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type SourceEntry } from "#/lib/types/source-entry.ts";

/** Source Collection */
export interface SourceCollection {
  sources: SourceEntry[];
}

/** Field metadata for forms and results. */
export const SourceCollectionFields: readonly FieldMeta[] = [
  { name: "sources", label: "Sources", kind: "other", required: true },
];
