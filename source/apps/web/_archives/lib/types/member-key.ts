import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Member Key */
export interface MemberKey {
  code: string;
}

/** Field metadata for forms and results. */
export const MemberKeyFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
];
