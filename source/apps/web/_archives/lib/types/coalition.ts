import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Coalition */
export interface Coalition {
  code: string;
  dissolvedOn?: string | null;
  formedOn?: string | null;
  kind: string;
  name: string;
}

/** Field metadata for forms and results. */
export const CoalitionFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  {
    name: "dissolvedOn",
    label: "Dissolved On",
    kind: "string",
    required: false,
  },
  { name: "formedOn", label: "Formed On", kind: "string", required: false },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
];
