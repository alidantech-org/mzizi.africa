import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { DatePrecision } from "#/lib/types/date-precision.enum.ts";

/** One drawing of a feature: a revision with a role, a basis, a confidence, a zoom range, a validity period and the stored file it came from. A feature has many; the current one has no end date. */
export interface Geometries {
  area: number;
  basisId: string;
  centroid: unknown;
  confidence?: number | null;
  createdAt: string;
  deletedAt?: string | null;
  envelope: unknown;
  featureId: string;
  fromToPrecision?: DatePrecision | null;
  fromYear?: number | null;
  geometry: unknown;
  geometryRoleId: string;
  id: string;
  maxZoom?: number | null;
  minZoom?: number | null;
  observedAt?: string | null;
  revision: number;
  srid: number;
  supersedesId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const GeometriesFields: readonly FieldMeta[] = [
  { name: "area", label: "Area", kind: "number", required: true },
  { name: "basisId", label: "Basis Id", kind: "string", required: true },
  { name: "centroid", label: "Centroid", kind: "other", required: true },
  { name: "confidence", label: "Confidence", kind: "number", required: false },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "envelope", label: "Envelope", kind: "other", required: true },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  {
    name: "fromToPrecision",
    label: "From To Precision",
    kind: "enum",
    required: false,
    options: Object.values(DatePrecision),
  },
  { name: "fromYear", label: "From Year", kind: "number", required: false },
  { name: "geometry", label: "Geometry", kind: "other", required: true },
  { name: "geometryRoleId", label: "Geometry Role Id", kind: "string", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "maxZoom", label: "Max Zoom", kind: "number", required: false },
  { name: "minZoom", label: "Min Zoom", kind: "number", required: false },
  { name: "observedAt", label: "Observed At", kind: "date", required: false },
  { name: "revision", label: "Revision", kind: "number", required: true },
  { name: "srid", label: "Srid", kind: "number", required: true },
  { name: "supersedesId", label: "Supersedes Id", kind: "string", required: false },
  { name: "toYear", label: "To Year", kind: "number", required: false },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
