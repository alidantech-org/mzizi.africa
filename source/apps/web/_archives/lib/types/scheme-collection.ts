import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type SchemeEntry } from "#/_archives/lib/types/scheme-entry";

/** Scheme Collection */
export interface SchemeCollection {
  schemes: SchemeEntry[];
}

/** Field metadata for forms and results. */
export const SchemeCollectionFields: readonly FieldMeta[] = [
  { name: "schemes", label: "Schemes", kind: "other", required: true },
];
