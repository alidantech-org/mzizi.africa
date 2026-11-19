import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Law Input */
export interface LawInput {
  kindCode?: string;
}

/** Field metadata for forms and results. */
export const LawInputFields: readonly FieldMeta[] = [
  { name: "kindCode", label: "Kind Code", kind: "string", required: false },
];
