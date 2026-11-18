import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Root Info */
export interface RootInfo {
  name: string;
  path: string;
}

/** Field metadata for forms and results. */
export const RootInfoFields: readonly FieldMeta[] = [
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "path", label: "Path", kind: "string", required: true },
];
