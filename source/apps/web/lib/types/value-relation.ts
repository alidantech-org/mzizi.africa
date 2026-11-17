import type { FieldMeta } from "../dryv/transport.ts";
import { ValueRelationKind } from "./value-relation-kind.enum.ts";
import { type Association } from "./association.ts";
import { type Value } from "./value.ts";

/** A directed, typed, time-aware relation between classification values; supports multi-parent and cross-scheme taxonomy, such as a regional label that maps to a broader global kind. */
export interface ValueRelation {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  relationKind: ValueRelationKind;
  sourceValueId: string;
  targetValueId: string;
  validFrom?: string | null;
  validUntil?: string | null;
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
  { name: "validFrom", label: "Valid From", kind: "date", required: false },
  { name: "validUntil", label: "Valid Until", kind: "date", required: false },
];
