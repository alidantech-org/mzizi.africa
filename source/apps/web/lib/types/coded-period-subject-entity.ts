import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { DatePrecision } from "#/lib/types/date-precision.enum.ts";
import { SubjectTable } from "#/lib/types/subject-table.enum.ts";

/** Base for versioned, coded records about one subject row, with a period of integer years. */
export interface CodedPeriodSubjectEntity {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  fromToPrecision?: DatePrecision | null;
  fromYear?: number | null;
  id: string;
  subjectId: string;
  subjectTable: SubjectTable;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const CodedPeriodSubjectEntityFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  {
    name: "fromToPrecision",
    label: "From To Precision",
    kind: "enum",
    required: false,
    options: Object.values(DatePrecision),
  },
  { name: "fromYear", label: "From Year", kind: "number", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "subjectId", label: "Subject Id", kind: "string", required: true },
  {
    name: "subjectTable",
    label: "Subject Table",
    kind: "enum",
    required: true,
    options: Object.values(SubjectTable),
  },
  { name: "toYear", label: "To Year", kind: "number", required: false },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
