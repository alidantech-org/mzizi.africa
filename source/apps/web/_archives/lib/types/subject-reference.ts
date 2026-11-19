import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { SubjectTable } from "#/_archives/lib/types/subject-table.enum";

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
