import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** A reviewed rule for generating expected records (institutions, positions, offices, site candidates) before real ones are found. It holds no versions, bindings or dependencies; see DEC-PATTERNS-GENERATE-EXPECTED-DATA-20261119. */
export interface Pattern {
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  id: string;
  kindId?: string | null;
  title: string;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const PatternFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "countryId", label: "Country Id", kind: "string", required: false },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  {
    name: "description",
    label: "Description",
    kind: "string",
    required: false,
  },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "kindId", label: "Kind Id", kind: "string", required: false },
  { name: "title", label: "Title", kind: "string", required: true },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
