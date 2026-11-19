import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Motion Detail Legal Fiscal Year */
export interface MotionDetailLegalFiscalYear {
  code: string;
  endsOn: string;
  startsOn: string;
}

/** Field metadata for forms and results. */
export const MotionDetailLegalFiscalYearFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "endsOn", label: "Ends On", kind: "string", required: true },
  { name: "startsOn", label: "Starts On", kind: "string", required: true },
];
