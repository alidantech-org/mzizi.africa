import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Project Detail */
export interface ProjectDetail {
  evidence: unknown[];
  gaps: string[];
  media: unknown[];
  money: unknown[];
  procurement?: unknown | null;
  project: unknown;
}

/** Field metadata for forms and results. */
export const ProjectDetailFields: readonly FieldMeta[] = [
  { name: "evidence", label: "Evidence", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "media", label: "Media", kind: "other", required: true },
  { name: "money", label: "Money", kind: "other", required: true },
  { name: "procurement", label: "Procurement", kind: "other", required: false },
  { name: "project", label: "Project", kind: "other", required: true },
];
