import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { DatePrecision } from "#/lib/types/date-precision.enum.ts";

/** A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems. */
export interface Relationships {
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  fromToPrecision?: DatePrecision | null;
  fromYear?: number | null;
  id: string;
  objectFeatureId: string;
  relationshipKindId: string;
  startsOn?: string | null;
  subjectFeatureId: string;
  systemId: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const RelationshipsFields: readonly FieldMeta[] = [
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "endsOn", label: "Ends On", kind: "date", required: false },
  {
    name: "fromToPrecision",
    label: "From To Precision",
    kind: "enum",
    required: false,
    options: Object.values(DatePrecision),
  },
  { name: "fromYear", label: "From Year", kind: "number", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "objectFeatureId", label: "Object Feature Id", kind: "string", required: true },
  { name: "relationshipKindId", label: "Relationship Kind Id", kind: "string", required: true },
  { name: "startsOn", label: "Starts On", kind: "date", required: false },
  { name: "subjectFeatureId", label: "Subject Feature Id", kind: "string", required: true },
  { name: "systemId", label: "System Id", kind: "string", required: true },
  { name: "toYear", label: "To Year", kind: "number", required: false },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
