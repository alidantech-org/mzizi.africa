import type { FieldMeta } from "../dryv/transport.ts";
import { type Features } from "./features.ts";
import { type HistoricalValidityEntity } from "./historical-validity-entity.ts";
import { type Value } from "./value.ts";

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
  fileVersionRefId?: string | null;
  geometry: unknown;
  geometryRoleId: string;
  id: string;
  maxZoom?: number | null;
  minZoom?: number | null;
  observedAt?: string | null;
  revision: number;
  srid: number;
  supersedesId?: string | null;
  updatedAt: string;
  validFrom?: string | null;
  validFromEarliest?: string | null;
  validFromLatest?: string | null;
  validUntil?: string | null;
  validUntilEarliest?: string | null;
  validUntilLatest?: string | null;
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
    name: "fileVersionRefId",
    label: "File Version Ref Id",
    kind: "string",
    required: false,
  },
  { name: "geometry", label: "Geometry", kind: "other", required: true },
  {
    name: "geometryRoleId",
    label: "Geometry Role Id",
    kind: "string",
    required: true,
  },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "maxZoom", label: "Max Zoom", kind: "number", required: false },
  { name: "minZoom", label: "Min Zoom", kind: "number", required: false },
  { name: "observedAt", label: "Observed At", kind: "date", required: false },
  { name: "revision", label: "Revision", kind: "number", required: true },
  { name: "srid", label: "Srid", kind: "number", required: true },
  {
    name: "supersedesId",
    label: "Supersedes Id",
    kind: "string",
    required: false,
  },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "validFrom", label: "Valid From", kind: "date", required: false },
  {
    name: "validFromEarliest",
    label: "Valid From Earliest",
    kind: "date",
    required: false,
  },
  {
    name: "validFromLatest",
    label: "Valid From Latest",
    kind: "date",
    required: false,
  },
  { name: "validUntil", label: "Valid Until", kind: "date", required: false },
  {
    name: "validUntilEarliest",
    label: "Valid Until Earliest",
    kind: "date",
    required: false,
  },
  {
    name: "validUntilLatest",
    label: "Valid Until Latest",
    kind: "date",
    required: false,
  },
  { name: "version", label: "Version", kind: "number", required: true },
];
