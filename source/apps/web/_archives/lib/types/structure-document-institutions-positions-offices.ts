import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Structure Document Institutions Positions Offices */
export interface StructureDocumentInstitutionsPositionsOffices {
  abolishedOn: string | null;
  code: string;
  featureId: string | null;
  id: string;
  ordinal: number | null;
}

/** Field metadata for forms and results. */
export const StructureDocumentInstitutionsPositionsOfficesFields: readonly FieldMeta[] =
  [
    {
      name: "abolishedOn",
      label: "Abolished On",
      kind: "date",
      required: false,
    },
    { name: "code", label: "Code", kind: "string", required: true },
    { name: "featureId", label: "Feature Id", kind: "string", required: false },
    { name: "id", label: "Id", kind: "string", required: true },
    { name: "ordinal", label: "Ordinal", kind: "number", required: false },
  ];
