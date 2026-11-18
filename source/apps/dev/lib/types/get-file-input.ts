import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Get File Input */
export interface GetFileInput {
  limit?: number;
  offset?: number;
  path: string;
  root: string;
}

/** Field metadata for forms and results. */
export const GetFileInputFields: readonly FieldMeta[] = [
  { name: "limit", label: "Limit", kind: "number", required: false },
  { name: "offset", label: "Offset", kind: "number", required: false },
  { name: "path", label: "Path", kind: "string", required: true },
  { name: "root", label: "Root", kind: "string", required: true },
];
