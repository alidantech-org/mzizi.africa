import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Catalog metadata for vector, raster, climate, elevation, historical and derived datasets. Large assets remain in the existing Filesystem/SeaweedFS S3 system; external references await executable Source and Filesystem contracts. */
export interface Datasets {
  code: string;
  coverageFeatureId?: string | null;
  createdAt: string;
  crs?: string | null;
  deletedAt?: string | null;
  fileVersionRefId?: string | null;
  format: string;
  id: string;
  qualityNotes?: string | null;
  representationId: string;
  resolution?: number | null;
  resolutionUnitId?: string | null;
  subjectId: string;
  title: string;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const DatasetsFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "coverageFeatureId", label: "Coverage Feature Id", kind: "string", required: false },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "crs", label: "Crs", kind: "string", required: false },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "fileVersionRefId", label: "File Version Ref Id", kind: "string", required: false },
  { name: "format", label: "Format", kind: "string", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "qualityNotes", label: "Quality Notes", kind: "string", required: false },
  { name: "representationId", label: "Representation Id", kind: "string", required: true },
  { name: "resolution", label: "Resolution", kind: "number", required: false },
  { name: "resolutionUnitId", label: "Resolution Unit Id", kind: "string", required: false },
  { name: "subjectId", label: "Subject Id", kind: "string", required: true },
  { name: "title", label: "Title", kind: "string", required: true },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
