import type { StructureStructureDocumentInstitutionsNames } from "#sdk/types/structure/dto/structure-document-institutions-names.ts";
import type { StructureStructureDocumentInstitutionsPositions } from "#sdk/types/structure/dto/structure-document-institutions-positions.ts";
import type { StructureStructureDocumentInstitutionsPowers } from "#sdk/types/structure/dto/structure-document-institutions-powers.ts";

/** Structure Document Institutions */
export interface StructureStructureDocumentInstitutions {
  arm: string | null;
  citationId: string | null;
  code: string;
  id: string;
  kind: string;
  names: StructureStructureDocumentInstitutionsNames[];
  positions: StructureStructureDocumentInstitutionsPositions[];
  powers: StructureStructureDocumentInstitutionsPowers[];
}
