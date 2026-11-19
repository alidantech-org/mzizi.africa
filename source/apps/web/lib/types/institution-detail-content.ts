import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type InstitutionDetailContentCategory } from "#/lib/types/institution-detail-content-category.ts";
import { type InstitutionDetailContentClassification } from "#/lib/types/institution-detail-content-classification.ts";
import { type InstitutionDetailContentFrontMatter } from "#/lib/types/institution-detail-content-front-matter.ts";
import { type InstitutionDetailContentSubject } from "#/lib/types/institution-detail-content-subject.ts";

/** Institution Detail Content */
export interface InstitutionDetailContent {
  body: string;
  category: InstitutionDetailContentCategory;
  classification: InstitutionDetailContentClassification;
  code: string;
  frontMatter: InstitutionDetailContentFrontMatter;
  image: string;
  isDevelopmentText: boolean;
  language: string;
  slug: string;
  subject: InstitutionDetailContentSubject;
  summary: string;
  tags: string[];
  title: string;
  unresolvedMedia: string[];
}

/** Field metadata for forms and results. */
export const InstitutionDetailContentFields: readonly FieldMeta[] = [
  { name: "body", label: "Body", kind: "string", required: true },
  { name: "category", label: "Category", kind: "other", required: true },
  { name: "classification", label: "Classification", kind: "other", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "frontMatter", label: "Front Matter", kind: "other", required: true },
  { name: "image", label: "Image", kind: "string", required: true },
  { name: "isDevelopmentText", label: "Is Development Text", kind: "boolean", required: true },
  { name: "language", label: "Language", kind: "string", required: true },
  { name: "slug", label: "Slug", kind: "string", required: true },
  { name: "subject", label: "Subject", kind: "other", required: true },
  { name: "summary", label: "Summary", kind: "string", required: true },
  { name: "tags", label: "Tags", kind: "string", required: true },
  { name: "title", label: "Title", kind: "string", required: true },
  { name: "unresolvedMedia", label: "Unresolved Media", kind: "string", required: true },
];
