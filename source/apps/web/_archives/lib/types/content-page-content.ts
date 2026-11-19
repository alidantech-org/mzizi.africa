import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type ContentPageContentCategory } from "#/_archives/lib/types/content-page-content-category";
import { type ContentPageContentFrontMatter } from "#/_archives/lib/types/content-page-content-front-matter";
import { type ContentPageContentSubject } from "#/_archives/lib/types/content-page-content-subject";
import { type InstitutionDetailContentClassification } from "#/_archives/lib/types/institution-detail-content-classification";

/** Content Page Content */
export interface ContentPageContent {
  body: string;
  category: ContentPageContentCategory;
  classification?: InstitutionDetailContentClassification | null;
  code: string;
  frontMatter: ContentPageContentFrontMatter;
  image?: string | null;
  isDevelopmentText: boolean;
  language: string;
  slug: string;
  subject: ContentPageContentSubject;
  summary: string;
  tags: string[];
  title: string;
  unresolvedMedia: string[];
}

/** Field metadata for forms and results. */
export const ContentPageContentFields: readonly FieldMeta[] = [
  { name: "body", label: "Body", kind: "string", required: true },
  { name: "category", label: "Category", kind: "other", required: true },
  {
    name: "classification",
    label: "Classification",
    kind: "other",
    required: false,
  },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "frontMatter", label: "Front Matter", kind: "other", required: true },
  { name: "image", label: "Image", kind: "string", required: false },
  {
    name: "isDevelopmentText",
    label: "Is Development Text",
    kind: "boolean",
    required: true,
  },
  { name: "language", label: "Language", kind: "string", required: true },
  { name: "slug", label: "Slug", kind: "string", required: true },
  { name: "subject", label: "Subject", kind: "other", required: true },
  { name: "summary", label: "Summary", kind: "string", required: true },
  { name: "tags", label: "Tags", kind: "string", required: true },
  { name: "title", label: "Title", kind: "string", required: true },
  {
    name: "unresolvedMedia",
    label: "Unresolved Media",
    kind: "string",
    required: true,
  },
];
