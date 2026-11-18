import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** One level of a country's administrative or electoral ladder: its depth and the kind of place found there. The ladder is data, so no screen or read names levels. */
export interface Levels {
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  depth: number;
  featureKindId: string;
  hierarchyKindId: string;
  id: string;
  isRoutingHierarchy: boolean;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const LevelsFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "countryId", label: "Country Id", kind: "string", required: true },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "depth", label: "Depth", kind: "number", required: true },
  { name: "featureKindId", label: "Feature Kind Id", kind: "string", required: true },
  { name: "hierarchyKindId", label: "Hierarchy Kind Id", kind: "string", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "isRoutingHierarchy", label: "Is Routing Hierarchy", kind: "boolean", required: true },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
