import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type LanguageChoice } from "#/_archives/lib/types/language-choice";

/** Language List */
export interface LanguageList {
  languages: LanguageChoice[];
}

/** Field metadata for forms and results. */
export const LanguageListFields: readonly FieldMeta[] = [
  { name: "languages", label: "Languages", kind: "other", required: true },
];
