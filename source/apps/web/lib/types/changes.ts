import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** An edge in a geographic transformation; multiple rows sharing transformation_id represent splits, mergers, creation or dissolution without overwriting predecessor identities. */
export interface Changes {
  changeKindId: string;
  createdAt: string;
  deletedAt?: string | null;
  effectiveOn?: string | null;
  explanation?: string | null;
  id: string;
  predecessorFeatureId?: string | null;
  successorFeatureId?: string | null;
  transformationId: string;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const ChangesFields: readonly FieldMeta[] = [
  { name: "changeKindId", label: "Change Kind Id", kind: "string", required: true },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "effectiveOn", label: "Effective On", kind: "date", required: false },
  { name: "explanation", label: "Explanation", kind: "string", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  {
    name: "predecessorFeatureId",
    label: "Predecessor Feature Id",
    kind: "string",
    required: false,
  },
  { name: "successorFeatureId", label: "Successor Feature Id", kind: "string", required: false },
  { name: "transformationId", label: "Transformation Id", kind: "string", required: true },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
