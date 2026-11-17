import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Feature Geometry */
export interface FeatureGeometry {
  basisId: string;
  centroid: unknown;
  confidence?: number | null;
  featureId: string;
  geometry: unknown;
  geometryId: string;
  geometryRoleId: string;
  maxZoom?: number | null;
  minZoom?: number | null;
  observedAt?: string | null;
  revision: number;
  validFrom: string;
}

/** Field metadata for forms and results. */
export const FeatureGeometryFields: readonly FieldMeta[] = [
  { name: "basisId", label: "Basis Id", kind: "string", required: true },
  { name: "centroid", label: "Centroid", kind: "other", required: true },
  { name: "confidence", label: "Confidence", kind: "number", required: false },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "geometry", label: "Geometry", kind: "other", required: true },
  { name: "geometryId", label: "Geometry Id", kind: "string", required: true },
  { name: "geometryRoleId", label: "Geometry Role Id", kind: "string", required: true },
  { name: "maxZoom", label: "Max Zoom", kind: "number", required: false },
  { name: "minZoom", label: "Min Zoom", kind: "number", required: false },
  { name: "observedAt", label: "Observed At", kind: "date", required: false },
  { name: "revision", label: "Revision", kind: "number", required: true },
  { name: "validFrom", label: "Valid From", kind: "date", required: true },
];
