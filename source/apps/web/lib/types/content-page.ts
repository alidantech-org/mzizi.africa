import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type ContentPageContent } from "#/lib/types/content-page-content.ts";
import { type ContentPageRelated } from "#/lib/types/content-page-related.ts";

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
