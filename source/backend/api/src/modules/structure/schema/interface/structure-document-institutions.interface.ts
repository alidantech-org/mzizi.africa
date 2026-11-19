import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { StructureDocumentInstitutionsNames } from "#/modules/structure/schema/interface/structure-document-institutions-names.interface.ts";
import type { StructureDocumentInstitutionsPositions } from "#/modules/structure/schema/interface/structure-document-institutions-positions.interface.ts";
import type { StructureDocumentInstitutionsPowers } from "#/modules/structure/schema/interface/structure-document-institutions-powers.interface.ts";

/** Structure Document Institutions */
export interface StructureDocumentInstitutions {
  arm: Name | null;
  citationId: Id | null;
  code: IdentityCode;
  id: Id;
  kind: Name;
  names: StructureDocumentInstitutionsNames[];
  positions: StructureDocumentInstitutionsPositions[];
  powers: StructureDocumentInstitutionsPowers[];
}
