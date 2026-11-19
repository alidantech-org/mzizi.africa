import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type CopyEntry } from "#/_archives/lib/types/copy-entry";

/** Copy Catalog */
export interface CopyCatalog {
  entries: CopyEntry[];
  languageCode: string;
}

/** Field metadata for forms and results. */
export const CopyCatalogFields: readonly FieldMeta[] = [
  { name: "entries", label: "Entries", kind: "other", required: true },
  {
    name: "languageCode",
    label: "Language Code",
    kind: "string",
    required: true,
  },
];
