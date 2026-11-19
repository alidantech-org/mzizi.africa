import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Language Choice */
export interface LanguageChoice {
  code: string;
  name: string;
  nativeName?: string | null;
}

/** Field metadata for forms and results. */
export const LanguageChoiceFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "nativeName", label: "Native Name", kind: "string", required: false },
];
