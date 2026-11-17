import type { FieldMeta } from "../dryv/transport.ts";

/** Capability */
export interface Capability {
  description?: string;
  kind: string;
}

/** Field metadata for forms and results. */
export const CapabilityFields: readonly FieldMeta[] = [
  {
    name: "description",
    label: "Description",
    kind: "string",
    required: false,
  },
  { name: "kind", label: "Kind", kind: "string", required: true },
];
