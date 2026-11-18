import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type DataList } from "#/lib/types/data-list.ts";

/** Data List List */
export interface DataListList {
  lists: DataList[];
}

/** Field metadata for forms and results. */
export const DataListListFields: readonly FieldMeta[] = [
  { name: "lists", label: "Lists", kind: "other", required: true },
];
