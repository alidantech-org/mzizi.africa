import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type StructureDocumentFunctions } from "#/lib/types/structure-document-functions.ts";
import { type StructureDocumentInstitutions } from "#/lib/types/structure-document-institutions.ts";
import { type StructureDocumentProcedures } from "#/lib/types/structure-document-procedures.ts";

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
  { name: "countryCode", label: "Country Code", kind: "string", required: false },
  { name: "countryId", label: "Country Id", kind: "string", required: true },
  { name: "countryName", label: "Country Name", kind: "string", required: true },
  { name: "functions", label: "Functions", kind: "other", required: true },
  { name: "institutions", label: "Institutions", kind: "other", required: true },
  { name: "procedures", label: "Procedures", kind: "other", required: true },
];
