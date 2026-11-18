import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Save File Result */
export interface SaveFileResult {
  path: string;
}

/** Field metadata for forms and results. */
export const SaveFileResultFields: readonly FieldMeta[] = [
  { name: "path", label: "Path", kind: "string", required: true },
];
