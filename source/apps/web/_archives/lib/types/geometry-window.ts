import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Geometry Window */
export interface GeometryWindow {
  east: number;
  featureTypeId?: string;
  limit?: number;
  north: number;
  offset?: number;
  simplifyTolerance?: number;
  south: number;
  west: number;
  zoom: number;
}

/** Field metadata for forms and results. */
export const GeometryWindowFields: readonly FieldMeta[] = [
  { name: "east", label: "East", kind: "number", required: true },
  {
    name: "featureTypeId",
    label: "Feature Type Id",
    kind: "string",
    required: false,
  },
  { name: "limit", label: "Limit", kind: "number", required: false },
  { name: "north", label: "North", kind: "number", required: true },
  { name: "offset", label: "Offset", kind: "number", required: false },
  {
    name: "simplifyTolerance",
    label: "Simplify Tolerance",
    kind: "number",
    required: false,
  },
  { name: "south", label: "South", kind: "number", required: true },
  { name: "west", label: "West", kind: "number", required: true },
  { name: "zoom", label: "Zoom", kind: "number", required: true },
];
