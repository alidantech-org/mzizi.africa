import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** One interface or explanatory wording for one copy key in one language, optionally specific to a country. Screens declare keys; the words live here. */
export interface Copy {
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  isDevelopmentText: boolean;
  key: string;
  languageId: string;
  text: string;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const CopyFields: readonly FieldMeta[] = [
  { name: "countryId", label: "Country Id", kind: "string", required: false },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  {
    name: "isDevelopmentText",
    label: "Is Development Text",
    kind: "boolean",
    required: true,
  },
  { name: "key", label: "Key", kind: "string", required: true },
  { name: "languageId", label: "Language Id", kind: "string", required: true },
  { name: "text", label: "Text", kind: "string", required: true },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
