import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** List Files Input */
export interface ListFilesInput {
  path?: string;
  root: string;
}

/** Field metadata for forms and results. */
export const ListFilesInputFields: readonly FieldMeta[] = [
  { name: "path", label: "Path", kind: "string", required: false },
  { name: "root", label: "Root", kind: "string", required: true },
];
