import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { DatePrecision } from "#/lib/types/date-precision.enum.ts";

/** Base for versioned records with a period of integer years and one precision for the pair. */
export interface PeriodEntity {
  createdAt: string;
  deletedAt?: string | null;
  fromToPrecision?: DatePrecision | null;
  fromYear?: number | null;
  id: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const PeriodEntityFields: readonly FieldMeta[] = [
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
  { name: "toYear", label: "To Year", kind: "number", required: false },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
