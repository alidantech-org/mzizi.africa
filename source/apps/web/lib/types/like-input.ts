import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Like Input */
export interface LikeInput {
  deviceId: string;
  subjectRef: string;
  subjectTable: string;
}

/** Field metadata for forms and results. */
export const LikeInputFields: readonly FieldMeta[] = [
  { name: "deviceId", label: "Device Id", kind: "string", required: true },
  { name: "subjectRef", label: "Subject Ref", kind: "string", required: true },
  { name: "subjectTable", label: "Subject Table", kind: "string", required: true },
];
