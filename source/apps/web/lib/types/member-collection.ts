import type { FieldMeta } from "../dryv/transport.ts";
import { type MemberEntry } from "./member-entry.ts";

/** Member Collection */
export interface MemberCollection {
  values: MemberEntry[];
}

/** Field metadata for forms and results. */
export const MemberCollectionFields: readonly FieldMeta[] = [
  { name: "values", label: "Values", kind: "other", required: true },
];
