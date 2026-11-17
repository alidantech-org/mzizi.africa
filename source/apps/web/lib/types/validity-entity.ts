import type { FieldMeta } from "../dryv/transport.ts";
import { type Entity } from "./entity.ts";

/** Base for versioned records valid over an optional period. */
export interface ValidityEntity {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}

/** Field metadata for forms and results. */
export const ValidityEntityFields: readonly FieldMeta[] = [
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "validFrom", label: "Valid From", kind: "date", required: false },
  { name: "validUntil", label: "Valid Until", kind: "date", required: false },
  { name: "version", label: "Version", kind: "number", required: true },
];
