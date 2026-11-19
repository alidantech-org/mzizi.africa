import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Content Input */
export interface ContentInput {
  languageCode?: string;
  slug?: string;
  subjectCode?: string;
  subjectTable?: string;
}

/** Field metadata for forms and results. */
export const ContentInputFields: readonly FieldMeta[] = [
  {
    name: "languageCode",
    label: "Language Code",
    kind: "string",
    required: false,
  },
  { name: "slug", label: "Slug", kind: "string", required: false },
  {
    name: "subjectCode",
    label: "Subject Code",
    kind: "string",
    required: false,
  },
  {
    name: "subjectTable",
    label: "Subject Table",
    kind: "string",
    required: false,
  },
];
