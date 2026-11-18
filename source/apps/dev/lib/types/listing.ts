import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type Entry } from "#/lib/types/entry.ts";

/** Listing */
export interface Listing {
  entries: Entry[];
  parent: string | null;
  path: string;
  root: string;
}

/** Field metadata for forms and results. */
export const ListingFields: readonly FieldMeta[] = [
  { name: "entries", label: "Entries", kind: "other", required: true },
  { name: "parent", label: "Parent", kind: "string", required: false },
  { name: "path", label: "Path", kind: "string", required: true },
  { name: "root", label: "Root", kind: "string", required: true },
];
