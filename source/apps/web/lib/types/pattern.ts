import type { FieldMeta } from "../dryv/transport.ts";
import { type CodedEntity } from "./coded-entity.ts";

/** Stable identity for a reusable, reviewed pattern definition. */
export interface Pattern {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  title: string;
  updatedAt: string;
  version: number;
}

/** Field metadata for forms and results. */
export const PatternFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "createdAt", label: "Created At", kind: "date", required: true },
  { name: "deletedAt", label: "Deleted At", kind: "date", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "title", label: "Title", kind: "string", required: true },
  { name: "updatedAt", label: "Updated At", kind: "date", required: true },
  { name: "version", label: "Version", kind: "number", required: true },
];
