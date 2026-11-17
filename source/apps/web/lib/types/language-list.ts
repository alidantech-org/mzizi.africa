import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type LanguageChoice } from "#/lib/types/language-choice.ts";

/** Language List */
export interface LanguageList {
  languages: LanguageChoice[];
}

/** Field metadata for forms and results. */
export const LanguageListFields: readonly FieldMeta[] = [
  { name: "languages", label: "Languages", kind: "other", required: true },
];
