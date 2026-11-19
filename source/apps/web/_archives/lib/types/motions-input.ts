import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Motions Input */
export interface MotionsInput {
  institutionId?: string;
  limit?: number;
}

/** Field metadata for forms and results. */
export const MotionsInputFields: readonly FieldMeta[] = [
  {
    name: "institutionId",
    label: "Institution Id",
    kind: "string",
    required: false,
  },
  { name: "limit", label: "Limit", kind: "number", required: false },
];
