import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** File View */
export interface FileView {
  actions: string[];
  header: string[];
  kind: string;
  modified: string;
  name: string;
  parsed?: unknown | null;
  path: string;
  root: string;
  rows: unknown[];
  size: number;
  text: string | null;
  totalRows: number | null;
  truncated: boolean;
}

/** Field metadata for forms and results. */
export const FileViewFields: readonly FieldMeta[] = [
  { name: "actions", label: "Actions", kind: "string", required: true },
  { name: "header", label: "Header", kind: "string", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "modified", label: "Modified", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "parsed", label: "Parsed", kind: "other", required: false },
  { name: "path", label: "Path", kind: "string", required: true },
  { name: "root", label: "Root", kind: "string", required: true },
  { name: "rows", label: "Rows", kind: "other", required: true },
  { name: "size", label: "Size", kind: "number", required: true },
  { name: "text", label: "Text", kind: "string", required: false },
  { name: "totalRows", label: "Total Rows", kind: "number", required: false },
  { name: "truncated", label: "Truncated", kind: "boolean", required: true },
];
