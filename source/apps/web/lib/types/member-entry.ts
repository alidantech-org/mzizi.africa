import type { FieldMeta } from "../dryv/transport.ts";

/** Member Entry */
export interface MemberEntry {
  code: string;
  id: string;
  label: string;
  supersedesId: string | null;
}

/** Field metadata for forms and results. */
export const MemberEntryFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
  {
    name: "supersedesId",
    label: "Supersedes Id",
    kind: "string",
    required: false,
  },
];
