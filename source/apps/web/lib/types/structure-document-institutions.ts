import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type StructureDocumentInstitutionsNames } from "#/lib/types/structure-document-institutions-names.ts";
import { type StructureDocumentInstitutionsPositions } from "#/lib/types/structure-document-institutions-positions.ts";
import { type StructureDocumentInstitutionsPowers } from "#/lib/types/structure-document-institutions-powers.ts";

/** Structure Document Institutions */
export interface StructureDocumentInstitutions {
  arm: string | null;
  citationId: string | null;
  code: string;
  id: string;
  kind: string;
  names: StructureDocumentInstitutionsNames[];
  positions: StructureDocumentInstitutionsPositions[];
  powers: StructureDocumentInstitutionsPowers[];
}

/** Field metadata for forms and results. */
export const StructureDocumentInstitutionsFields: readonly FieldMeta[] = [
  { name: "arm", label: "Arm", kind: "string", required: false },
  { name: "citationId", label: "Citation Id", kind: "string", required: false },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "names", label: "Names", kind: "other", required: true },
  { name: "positions", label: "Positions", kind: "other", required: true },
  { name: "powers", label: "Powers", kind: "other", required: true },
];
