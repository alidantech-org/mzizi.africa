import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Engagement Input */
export interface EngagementInput {
  deviceId?: string;
  subjectRef: string;
  subjectTable: string;
}

/** Field metadata for forms and results. */
export const EngagementInputFields: readonly FieldMeta[] = [
  { name: "deviceId", label: "Device Id", kind: "string", required: false },
  { name: "subjectRef", label: "Subject Ref", kind: "string", required: true },
  {
    name: "subjectTable",
    label: "Subject Table",
    kind: "string",
    required: true,
  },
];
