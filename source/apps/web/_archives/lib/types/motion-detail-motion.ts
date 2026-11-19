import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type MotionDetailMotionContributions } from "#/_archives/lib/types/motion-detail-motion-contributions";

/** Motion Detail Motion */
export interface MotionDetailMotion {
  code: string;
  contributions: MotionDetailMotionContributions[];
  heldOn: string;
  institution: string;
  institutionId: string;
  kind: string;
  movedBy: string;
  outcome: string;
  sitting: string;
  summary: string;
  title: string;
}

/** Field metadata for forms and results. */
export const MotionDetailMotionFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  {
    name: "contributions",
    label: "Contributions",
    kind: "other",
    required: true,
  },
  { name: "heldOn", label: "Held On", kind: "string", required: true },
  { name: "institution", label: "Institution", kind: "string", required: true },
  {
    name: "institutionId",
    label: "Institution Id",
    kind: "string",
    required: true,
  },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "movedBy", label: "Moved By", kind: "string", required: true },
  { name: "outcome", label: "Outcome", kind: "string", required: true },
  { name: "sitting", label: "Sitting", kind: "string", required: true },
  { name: "summary", label: "Summary", kind: "string", required: true },
  { name: "title", label: "Title", kind: "string", required: true },
];
