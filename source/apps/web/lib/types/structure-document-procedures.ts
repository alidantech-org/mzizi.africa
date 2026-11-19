import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Structure Document Procedures */
export interface StructureDocumentProcedures {
  citationId: string | null;
  code: string;
  description: string;
  id: string;
  kind: string;
}

/** Field metadata for forms and results. */
export const StructureDocumentProceduresFields: readonly FieldMeta[] = [
  { name: "citationId", label: "Citation Id", kind: "string", required: false },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "description", label: "Description", kind: "string", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
];
