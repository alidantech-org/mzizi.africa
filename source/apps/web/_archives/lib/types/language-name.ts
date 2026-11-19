import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { LanguageNameKind } from "#/_archives/lib/types/language-name-kind.enum";

/** A name of a language written in a language, such as Kiswahili (endonym) and Swahili (exonym). */
export interface LanguageName {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  inLanguageId: string;
  languageId: string;
  name: string;
  nameKind: LanguageNameKind;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const LanguageNameFields: readonly FieldMeta[] = [
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  {
    name: "inLanguageId",
    label: "In Language Id",
    kind: "string",
    required: true,
  },
  { name: "languageId", label: "Language Id", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  {
    name: "nameKind",
    label: "Name Kind",
    kind: "enum",
    required: true,
    options: Object.values(LanguageNameKind),
  },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
