import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type ContentListItemsCategory } from "#/_archives/lib/types/content-list-items-category";
import { type ContentListItemsClassification } from "#/_archives/lib/types/content-list-items-classification";
import { type ContentListItemsFrontMatter } from "#/_archives/lib/types/content-list-items-front-matter";
import { type ContentListItemsSubject } from "#/_archives/lib/types/content-list-items-subject";

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
  {
    name: "classification",
    label: "Classification",
    kind: "other",
    required: true,
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
