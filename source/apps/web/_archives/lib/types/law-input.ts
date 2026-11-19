import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Law Input */
export interface LawInput {
  kindCode?: string;
}

/** Field metadata for forms and results. */
export const LawInputFields: readonly FieldMeta[] = [
  { name: "kindCode", label: "Kind Code", kind: "string", required: false },
];
