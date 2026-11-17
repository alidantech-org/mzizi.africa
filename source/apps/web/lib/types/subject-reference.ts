import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { SubjectTable } from "#/lib/types/subject-table.enum.ts";

/** Base for a record about one subject: the subject's fully qualified table and its row id. Contributes no other fields. */
export interface SubjectReference {
  subjectId: string;
  subjectTable: SubjectTable;
}

/** Field metadata for forms and results. */
export const SubjectReferenceFields: readonly FieldMeta[] = [
  { name: "subjectId", label: "Subject Id", kind: "string", required: true },
  {
    name: "subjectTable",
    label: "Subject Table",
    kind: "enum",
    required: true,
    options: Object.values(SubjectTable),
  },
];
