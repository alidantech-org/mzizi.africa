import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Capability */
export interface Capability {
  description?: string;
  name: string;
  package: string;
  version: string;
}

/** Field metadata for forms and results. */
export const CapabilityFields: readonly FieldMeta[] = [
  { name: "description", label: "Description", kind: "string", required: false },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "package", label: "Package", kind: "string", required: true },
  { name: "version", label: "Version", kind: "string", required: true },
];
