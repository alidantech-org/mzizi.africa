import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type StructureDocumentInstitutionsPositionsOffices } from "#/lib/types/structure-document-institutions-positions-offices.ts";
import { type StructureDocumentInstitutionsPositionsPowers } from "#/lib/types/structure-document-institutions-positions-powers.ts";

/** Structure Document Institutions Positions */
export interface StructureDocumentInstitutionsPositions {
  citationId: string | null;
  code: string;
  fixedSeats: number | null;
  id: string;
  offices: StructureDocumentInstitutionsPositionsOffices[];
  powers: StructureDocumentInstitutionsPositionsPowers[];
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

/** Field metadata for forms and results. */
export const StructureDocumentInstitutionsPositionsFields: readonly FieldMeta[] = [
  { name: "citationId", label: "Citation Id", kind: "string", required: false },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "fixedSeats", label: "Fixed Seats", kind: "number", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "offices", label: "Offices", kind: "other", required: true },
  { name: "powers", label: "Powers", kind: "other", required: true },
  { name: "role", label: "Role", kind: "string", required: true },
  { name: "seatBasisCode", label: "Seat Basis Code", kind: "string", required: true },
  { name: "seatBasisLabel", label: "Seat Basis Label", kind: "string", required: true },
  { name: "selectionCode", label: "Selection Code", kind: "string", required: true },
  { name: "selectionLabel", label: "Selection Label", kind: "string", required: true },
  { name: "termLimit", label: "Term Limit", kind: "number", required: false },
  { name: "termYears", label: "Term Years", kind: "number", required: false },
  { name: "title", label: "Title", kind: "string", required: true },
  { name: "unitLevelId", label: "Unit Level Id", kind: "string", required: false },
];
