import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type CopyEntry } from "#/lib/types/copy-entry.ts";

/** Copy Catalog */
export interface CopyCatalog {
  entries: CopyEntry[];
  languageCode: string;
}

/** Field metadata for forms and results. */
export const CopyCatalogFields: readonly FieldMeta[] = [
  { name: "entries", label: "Entries", kind: "other", required: true },
  { name: "languageCode", label: "Language Code", kind: "string", required: true },
];
