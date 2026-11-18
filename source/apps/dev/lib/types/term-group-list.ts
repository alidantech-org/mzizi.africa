import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type TermGroup } from "#/lib/types/term-group.ts";

/** Term Group List */
export interface TermGroupList {
  groups: TermGroup[];
}

/** Field metadata for forms and results. */
export const TermGroupListFields: readonly FieldMeta[] = [
  { name: "groups", label: "Groups", kind: "other", required: true },
];
