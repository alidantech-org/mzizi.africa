import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type SourceEntry } from "#/_archives/lib/types/source-entry";

/** Source Collection */
export interface SourceCollection {
  sources: SourceEntry[];
}

/** Field metadata for forms and results. */
export const SourceCollectionFields: readonly FieldMeta[] = [
  { name: "sources", label: "Sources", kind: "other", required: true },
];
