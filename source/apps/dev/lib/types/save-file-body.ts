import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Save File Body */
export interface SaveFileBody {
  overwrite?: boolean;
  path: string;
  text: string;
}

/** Field metadata for forms and results. */
export const SaveFileBodyFields: readonly FieldMeta[] = [
  { name: "overwrite", label: "Overwrite", kind: "boolean", required: false },
  { name: "path", label: "Path", kind: "string", required: true },
  { name: "text", label: "Text", kind: "string", required: true },
];
