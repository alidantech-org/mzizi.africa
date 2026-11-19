import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Leader Profile Contacts */
export interface LeaderProfileContacts {
  kind: string;
  scope: string;
  value: string;
  visibility: string;
}

/** Field metadata for forms and results. */
export const LeaderProfileContactsFields: readonly FieldMeta[] = [
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "scope", label: "Scope", kind: "string", required: true },
  { name: "value", label: "Value", kind: "string", required: true },
  { name: "visibility", label: "Visibility", kind: "string", required: true },
];
