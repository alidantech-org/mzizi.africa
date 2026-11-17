import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type MemberEntry } from "#/lib/types/member-entry.ts";

/** Member Collection */
export interface MemberCollection {
  values: MemberEntry[];
}

/** Field metadata for forms and results. */
export const MemberCollectionFields: readonly FieldMeta[] = [
  { name: "values", label: "Values", kind: "other", required: true },
];
