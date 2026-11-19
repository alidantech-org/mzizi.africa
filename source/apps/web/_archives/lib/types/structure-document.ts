import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type StructureDocumentFunctions } from "#/_archives/lib/types/structure-document-functions";
import { type StructureDocumentInstitutions } from "#/_archives/lib/types/structure-document-institutions";
import { type StructureDocumentProcedures } from "#/_archives/lib/types/structure-document-procedures";

/** Structure Document */
export interface StructureDocument {
  countryCode: string | null;
  countryId: string;
  countryName: string;
  functions: StructureDocumentFunctions[];
  institutions: StructureDocumentInstitutions[];
  procedures: StructureDocumentProcedures[];
}

/** Field metadata for forms and results. */
export const StructureDocumentFields: readonly FieldMeta[] = [
  {
    name: "countryCode",
    label: "Country Code",
    kind: "string",
    required: false,
  },
  { name: "countryId", label: "Country Id", kind: "string", required: true },
  {
    name: "countryName",
    label: "Country Name",
    kind: "string",
    required: true,
  },
  { name: "functions", label: "Functions", kind: "other", required: true },
  {
    name: "institutions",
    label: "Institutions",
    kind: "other",
    required: true,
  },
  { name: "procedures", label: "Procedures", kind: "other", required: true },
];
