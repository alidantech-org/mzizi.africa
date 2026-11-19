import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { SubjectTable } from "#/_archives/lib/types/subject-table.enum";

/** Base for versioned, coded records about one subject row. */
export interface CodedSubjectEntity {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  subjectId: string;
  subjectTable: SubjectTable;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const CodedSubjectEntityFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "subjectId", label: "Subject Id", kind: "string", required: true },
  {
    name: "subjectTable",
    label: "Subject Table",
    kind: "enum",
    required: true,
    options: Object.values(SubjectTable),
  },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
