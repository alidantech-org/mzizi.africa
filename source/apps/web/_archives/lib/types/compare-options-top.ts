import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Compare Options Top */
export interface CompareOptionsTop {
  detail: string;
  featureId: string;
  name: string;
  path: string;
  rank: number;
  share: number;
  subjectId?: string | null;
  value: number;
}

/** Field metadata for forms and results. */
export const CompareOptionsTopFields: readonly FieldMeta[] = [
  { name: "detail", label: "Detail", kind: "string", required: true },
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "path", label: "Path", kind: "string", required: true },
  { name: "rank", label: "Rank", kind: "number", required: true },
  { name: "share", label: "Share", kind: "number", required: true },
  { name: "subjectId", label: "Subject Id", kind: "string", required: false },
  { name: "value", label: "Value", kind: "number", required: true },
];
