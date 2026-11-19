import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Motion Detail Legal Provision */
export interface MotionDetailLegalProvision {
  designation: string;
  instrument: string;
  title: string;
}

/** Field metadata for forms and results. */
export const MotionDetailLegalProvisionFields: readonly FieldMeta[] = [
  { name: "designation", label: "Designation", kind: "string", required: true },
  { name: "instrument", label: "Instrument", kind: "string", required: true },
  { name: "title", label: "Title", kind: "string", required: true },
];
