import type { FieldMeta } from "../dryv/transport.ts";
import { type HistoricalValidityEntity } from "./historical-validity-entity.ts";

/** Base for versioned records with a unique identity code and an uncertain validity period. */
export interface CodedHistoricalEntity {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
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
export const CodedHistoricalEntityFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
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
