import type { FieldMeta } from "../dryv/transport.ts";
import { type Entity } from "./entity.ts";
import { type Features } from "./features.ts";
import { type Value } from "./value.ts";

/** A preserved identifier assigned to a feature by an external geographic registry or source system. */
export interface Identifiers {
  createdAt: string;
  deletedAt?: string | null;
  externalId: string;
  featureId: string;
  id: string;
  identifierSchemeId: string;
  namespace?: string | null;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const IdentifiersFields: readonly FieldMeta[] = [
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "externalId", label: "External Id", kind: "string", required: true },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  {
    name: "identifierSchemeId",
    label: "Identifier Scheme Id",
    kind: "string",
    required: true,
  },
  { name: "namespace", label: "Namespace", kind: "string", required: false },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
