import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type MemberEntry } from "#/_archives/lib/types/member-entry";

/** Member Collection */
export interface MemberCollection {
  values: MemberEntry[];
}

/** Field metadata for forms and results. */
export const MemberCollectionFields: readonly FieldMeta[] = [
  { name: "values", label: "Values", kind: "other", required: true },
];
