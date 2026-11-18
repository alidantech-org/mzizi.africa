import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type TaggedText } from "#/lib/types/tagged-text.ts";

/** Tagged List */
export interface TaggedList {
  items: TaggedText[];
}

/** Field metadata for forms and results. */
export const TaggedListFields: readonly FieldMeta[] = [
  { name: "items", label: "Items", kind: "other", required: true },
];
