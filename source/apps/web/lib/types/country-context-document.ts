import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type CountryContextDocumentLevels } from "#/lib/types/country-context-document-levels.ts";

/** Country Context Document */
export interface CountryContextDocument {
  code: string | null;
  countryId: string;
  levels: CountryContextDocumentLevels[];
  name: string;
}

/** Field metadata for forms and results. */
export const CountryContextDocumentFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: false },
  { name: "countryId", label: "Country Id", kind: "string", required: true },
  { name: "levels", label: "Levels", kind: "other", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
];
