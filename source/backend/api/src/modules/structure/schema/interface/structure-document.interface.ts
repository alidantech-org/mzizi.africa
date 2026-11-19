import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { StructureDocumentFunctions } from "#/modules/structure/schema/interface/structure-document-functions.interface.ts";
import type { StructureDocumentInstitutions } from "#/modules/structure/schema/interface/structure-document-institutions.interface.ts";
import type { StructureDocumentProcedures } from "#/modules/structure/schema/interface/structure-document-procedures.interface.ts";

/** Structure Document */
export interface StructureDocument {
  countryCode: IsoAlpha2 | null;
  countryId: Id;
  countryName: Name;
  functions: StructureDocumentFunctions[];
  institutions: StructureDocumentInstitutions[];
  procedures: StructureDocumentProcedures[];
}
