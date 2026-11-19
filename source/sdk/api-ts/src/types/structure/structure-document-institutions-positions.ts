import type { StructureStructureDocumentInstitutionsPositionsOffices } from "#sdk/types/structure/structure-document-institutions-positions-offices.ts";
import type { StructureStructureDocumentInstitutionsPositionsPowers } from "#sdk/types/structure/structure-document-institutions-positions-powers.ts";

/** Structure Document Institutions Positions */
export interface StructureStructureDocumentInstitutionsPositions {
  citationId: string | null;
  code: string;
  fixedSeats: number | null;
  id: string;
  offices: StructureStructureDocumentInstitutionsPositionsOffices[];
  powers: StructureStructureDocumentInstitutionsPositionsPowers[];
  role: string;
  seatBasisCode: string;
  seatBasisLabel: string;
  selectionCode: string;
  selectionLabel: string;
  termLimit: number | null;
  termYears: number | null;
  title: string;
  unitLevelId: string | null;
}
