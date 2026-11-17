import type { FieldMeta } from "../dryv/transport.ts";
import { type Features } from "./features.ts";
import { type HistoricalValidityEntity } from "./historical-validity-entity.ts";
import { type Value } from "./value.ts";

/** A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems. */
export interface Relationships {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  objectFeatureId: string;
  relationshipKindId: string;
  subjectFeatureId: string;
  systemId: string;
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
export const RelationshipsFields: readonly FieldMeta[] = [
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  {
    name: "objectFeatureId",
    label: "Object Feature Id",
    kind: "string",
    required: true,
  },
  {
    name: "relationshipKindId",
    label: "Relationship Kind Id",
    kind: "string",
    required: true,
  },
  {
    name: "subjectFeatureId",
    label: "Subject Feature Id",
    kind: "string",
    required: true,
  },
  { name: "systemId", label: "System Id", kind: "string", required: true },
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
