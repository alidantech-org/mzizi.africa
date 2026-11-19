import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Manifesto */
export interface Manifesto {
  code: string;
  election?: string | null;
  party?: string | null;
  publishedOn?: string | null;
}

/** Field metadata for forms and results. */
export const ManifestoFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "election", label: "Election", kind: "string", required: false },
  { name: "party", label: "Party", kind: "string", required: false },
  {
    name: "publishedOn",
    label: "Published On",
    kind: "string",
    required: false,
  },
];
