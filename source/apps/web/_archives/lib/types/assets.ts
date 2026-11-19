import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** A stored GIS file used for a feature or for one of its geometries. One file can serve many features and a feature can have many files. Photographs and video are filesystem media; acquisition and provenance belong to Source. */
export interface Assets {
  band?: number | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  featureId: string;
  fileVersionId: string;
  geometryId?: string | null;
  id: string;
  kindId: string;
  layer?: string | null;
  member?: string | null;
  purposeId: string;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const AssetsFields: readonly FieldMeta[] = [
  { name: "band", label: "Band", kind: "number", required: false },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  {
    name: "description",
    label: "Description",
    kind: "string",
    required: false,
  },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  {
    name: "fileVersionId",
    label: "File Version Id",
    kind: "string",
    required: true,
  },
  { name: "geometryId", label: "Geometry Id", kind: "string", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "kindId", label: "Kind Id", kind: "string", required: true },
  { name: "layer", label: "Layer", kind: "string", required: false },
  { name: "member", label: "Member", kind: "string", required: false },
  { name: "purposeId", label: "Purpose Id", kind: "string", required: true },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
