import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Content Page */
export interface ContentPage {
  content?: unknown | null;
  gaps: string[];
  related: unknown[];
}

/** Field metadata for forms and results. */
export const ContentPageFields: readonly FieldMeta[] = [
  { name: "content", label: "Content", kind: "other", required: false },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "related", label: "Related", kind: "other", required: true },
];
