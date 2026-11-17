import type { FieldMeta } from "../dryv/transport.ts";
import { type SchemeEntry } from "./scheme-entry.ts";

/** Scheme Collection */
export interface SchemeCollection {
  schemes: SchemeEntry[];
}

/** Field metadata for forms and results. */
export const SchemeCollectionFields: readonly FieldMeta[] = [
  { name: "schemes", label: "Schemes", kind: "other", required: true },
];
