import type { FieldMeta } from "../dryv/transport.ts";

/** Member Key */
export interface MemberKey {
  code: string;
}

/** Field metadata for forms and results. */
export const MemberKeyFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
];
