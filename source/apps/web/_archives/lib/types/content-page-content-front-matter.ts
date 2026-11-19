import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Content Page Content Front Matter */
export interface ContentPageContentFrontMatter {
  citationId: string;
}

/** Field metadata for forms and results. */
export const ContentPageContentFrontMatterFields: readonly FieldMeta[] = [
  { name: "citationId", label: "Citation Id", kind: "string", required: true },
];
