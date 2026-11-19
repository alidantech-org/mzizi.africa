import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type ContentPageContent } from "#/_archives/lib/types/content-page-content";
import { type ContentPageRelated } from "#/_archives/lib/types/content-page-related";

/** Content Page */
export interface ContentPage {
  content: ContentPageContent;
  gaps: string[];
  related: ContentPageRelated[];
}

/** Field metadata for forms and results. */
export const ContentPageFields: readonly FieldMeta[] = [
  { name: "content", label: "Content", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "related", label: "Related", kind: "other", required: true },
];
