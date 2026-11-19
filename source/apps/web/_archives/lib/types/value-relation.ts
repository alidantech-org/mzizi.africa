import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { ValueRelationKind } from "#/_archives/lib/types/value-relation-kind.enum";

/** A directed, typed, relation between classification values; supports multi-parent and cross-scheme taxonomy, such as a regional label that maps to a broader global kind. */
export interface ValueRelation {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  relationKind: ValueRelationKind;
  sourceValueId: string;
  targetValueId: string;
}

/** Field metadata for forms and results. */
export const ValueRelationFields: readonly FieldMeta[] = [
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  {
    name: "relationKind",
    label: "Relation Kind",
    kind: "enum",
    required: true,
    options: Object.values(ValueRelationKind),
  },
  {
    name: "sourceValueId",
    label: "Source Value Id",
    kind: "string",
    required: true,
  },
  {
    name: "targetValueId",
    label: "Target Value Id",
    kind: "string",
    required: true,
  },
];
