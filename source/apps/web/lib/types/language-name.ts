import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { LanguageNameKind } from "#/lib/types/language-name-kind.enum.ts";

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
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}

/** Field metadata for forms and results. */
export const LanguageNameFields: readonly FieldMeta[] = [
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "inLanguageId", label: "In Language Id", kind: "string", required: true },
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
  { name: "validFrom", label: "Valid From", kind: "date", required: false },
  { name: "validUntil", label: "Valid Until", kind: "date", required: false },
  { name: "version", label: "Version", kind: "number", required: true },
];
