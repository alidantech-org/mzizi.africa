import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { DatePrecision } from "#/lib/types/date-precision.enum.ts";

/** One dated classification of a feature by a scheme value, so a feature can answer several classification questions and change over time. */
export interface Classifications {
  createdAt: string;
  deletedAt?: string | null;
  featureId: string;
  fromToPrecision?: DatePrecision | null;
  fromYear?: number | null;
  id: string;
  toYear?: number | null;
  updatedAt: string;
  valueId: string;
  version: number;
}

/** Field metadata for forms and results. */
export const ClassificationsFields: readonly FieldMeta[] = [
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
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
  { name: "valueId", label: "Value Id", kind: "string", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
