import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** A canonical, official, local, alternative, translated or historical name for a feature, with its language (`mul` or `und` when no single language applies), validity and provenance reference. */
export interface Names {
  createdAt: string;
  deletedAt?: string | null;
  featureId: string;
  id: string;
  isDefault: boolean;
  languageId: string;
  name: string;
  nameKindId: string;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}

/** Field metadata for forms and results. */
export const NamesFields: readonly FieldMeta[] = [
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "isDefault", label: "Is Default", kind: "boolean", required: true },
  { name: "languageId", label: "Language Id", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "nameKindId", label: "Name Kind Id", kind: "string", required: true },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "validFrom", label: "Valid From", kind: "date", required: false },
  { name: "validUntil", label: "Valid Until", kind: "date", required: false },
  { name: "version", label: "Version", kind: "number", required: true },
];
