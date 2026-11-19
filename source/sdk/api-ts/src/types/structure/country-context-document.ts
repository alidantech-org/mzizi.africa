import type { StructureCountryContextDocumentLevels } from "#sdk/types/structure/country-context-document-levels.ts";

/** Country Context Document */
export interface StructureCountryContextDocument {
  code: string | null;
  countryId: string;
  levels: StructureCountryContextDocumentLevels[];
  name: string;
}
