import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Institution Detail Content Front Matter */
export interface InstitutionDetailContentFrontMatter {
  image: string;
}

/** Field metadata for forms and results. */
export const InstitutionDetailContentFrontMatterFields: readonly FieldMeta[] = [
  { name: "image", label: "Image", kind: "string", required: true },
];
