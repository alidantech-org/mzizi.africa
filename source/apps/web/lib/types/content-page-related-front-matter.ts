import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Content Page Related Front Matter */
export interface ContentPageRelatedFrontMatter {
  citationId: string;
  parent: string;
}

/** Field metadata for forms and results. */
export const ContentPageRelatedFrontMatterFields: readonly FieldMeta[] = [
  { name: "citationId", label: "Citation Id", kind: "string", required: true },
  { name: "parent", label: "Parent", kind: "string", required: true },
];
