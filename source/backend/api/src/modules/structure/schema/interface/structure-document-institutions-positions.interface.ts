import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { StructureDocumentInstitutionsPositionsOffices } from "#/modules/structure/schema/interface/structure-document-institutions-positions-offices.interface.ts";
import type { StructureDocumentInstitutionsPositionsPowers } from "#/modules/structure/schema/interface/structure-document-institutions-positions-powers.interface.ts";

/** Structure Document Institutions Positions */
export interface StructureDocumentInstitutionsPositions {
  citationId: Id | null;
  code: IdentityCode;
  fixedSeats: PositiveInteger | null;
  id: Id;
  offices: StructureDocumentInstitutionsPositionsOffices[];
  powers: StructureDocumentInstitutionsPositionsPowers[];
  role: Name;
  seatBasisCode: IdentityCode;
  seatBasisLabel: Name;
  selectionCode: IdentityCode;
  selectionLabel: Name;
  termLimit: PositiveInteger | null;
  termYears: PositiveInteger | null;
  title: Name;
  unitLevelId: Id | null;
}
