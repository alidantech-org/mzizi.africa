import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Entry */
export interface Entry {
  directory: boolean;
  kind: string;
  modified: string;
  name: string;
  path: string;
  size: number;
}

/** Field metadata for forms and results. */
export const EntryFields: readonly FieldMeta[] = [
  { name: "directory", label: "Directory", kind: "boolean", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "modified", label: "Modified", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "path", label: "Path", kind: "string", required: true },
  { name: "size", label: "Size", kind: "number", required: true },
];
