import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { DatePrecision } from "#/_archives/lib/types/date-precision.enum";

/** The sole canonical identity for each geographic entity, whatever its type. Country, parentage and administrative or electoral membership are dated relationships, never columns here. */
export interface Features {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  endedOn?: string | null;
  establishedOn?: string | null;
  featureTypeId: string;
  fromToPrecision?: DatePrecision | null;
  fromYear?: number | null;
  id: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const FeaturesFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "endedOn", label: "Ended On", kind: "date", required: false },
  {
    name: "establishedOn",
    label: "Established On",
    kind: "date",
    required: false,
  },
  {
    name: "featureTypeId",
    label: "Feature Type Id",
    kind: "string",
    required: true,
  },
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
