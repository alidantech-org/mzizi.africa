import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type ContentListItemsCategory } from "#/lib/types/content-list-items-category.ts";
import { type ContentListItemsClassification } from "#/lib/types/content-list-items-classification.ts";
import { type ContentListItemsFrontMatter } from "#/lib/types/content-list-items-front-matter.ts";
import { type ContentListItemsSubject } from "#/lib/types/content-list-items-subject.ts";

/** Content List Items */
export interface ContentListItems {
  body: string;
  category: ContentListItemsCategory;
  classification: ContentListItemsClassification;
  code: string;
  frontMatter: ContentListItemsFrontMatter;
  image?: string | null;
  isDevelopmentText: boolean;
  language: string;
  slug: string;
  subject: ContentListItemsSubject;
  summary: string;
  tags: string[];
  title: string;
  unresolvedMedia: string[];
}

/** Field metadata for forms and results. */
export const ContentListItemsFields: readonly FieldMeta[] = [
  { name: "body", label: "Body", kind: "string", required: true },
  { name: "category", label: "Category", kind: "other", required: true },
  { name: "classification", label: "Classification", kind: "other", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "frontMatter", label: "Front Matter", kind: "other", required: true },
  { name: "image", label: "Image", kind: "string", required: false },
  { name: "isDevelopmentText", label: "Is Development Text", kind: "boolean", required: true },
  { name: "language", label: "Language", kind: "string", required: true },
  { name: "slug", label: "Slug", kind: "string", required: true },
  { name: "subject", label: "Subject", kind: "other", required: true },
  { name: "summary", label: "Summary", kind: "string", required: true },
  { name: "tags", label: "Tags", kind: "string", required: true },
  { name: "title", label: "Title", kind: "string", required: true },
  { name: "unresolvedMedia", label: "Unresolved Media", kind: "string", required: true },
];
