import type { StructureStructureDocumentFunctions } from "#sdk/types/structure/dto/structure-document-functions.ts";
import type { StructureStructureDocumentInstitutions } from "#sdk/types/structure/dto/structure-document-institutions.ts";
import type { StructureStructureDocumentProcedures } from "#sdk/types/structure/dto/structure-document-procedures.ts";

/** Structure Document */
export interface StructureStructureDocument {
  countryCode: string | null;
  countryId: string;
  countryName: string;
  functions: StructureStructureDocumentFunctions[];
  institutions: StructureStructureDocumentInstitutions[];
  procedures: StructureStructureDocumentProcedures[];
}
