import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Motion List Motions */
export interface MotionListMotions {
  absent: number;
  abstain: number;
  code: string;
  heldOn: string;
  institution: string;
  institutionId: string;
  kind: string;
  no: number;
  outcome: string;
  summary: string;
  title: string;
  yes: number;
}

/** Field metadata for forms and results. */
export const MotionListMotionsFields: readonly FieldMeta[] = [
  { name: "absent", label: "Absent", kind: "number", required: true },
  { name: "abstain", label: "Abstain", kind: "number", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "heldOn", label: "Held On", kind: "string", required: true },
  { name: "institution", label: "Institution", kind: "string", required: true },
  {
    name: "institutionId",
    label: "Institution Id",
    kind: "string",
    required: true,
  },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "no", label: "No", kind: "number", required: true },
  { name: "outcome", label: "Outcome", kind: "string", required: true },
  { name: "summary", label: "Summary", kind: "string", required: true },
  { name: "title", label: "Title", kind: "string", required: true },
  { name: "yes", label: "Yes", kind: "number", required: true },
];
