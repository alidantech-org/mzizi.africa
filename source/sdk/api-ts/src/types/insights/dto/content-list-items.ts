import type { InsightsContentListItemsCategory } from "#sdk/types/insights/dto/content-list-items-category.ts";
import type { InsightsContentListItemsClassification } from "#sdk/types/insights/dto/content-list-items-classification.ts";
import type { InsightsContentListItemsFrontMatter } from "#sdk/types/insights/dto/content-list-items-front-matter.ts";
import type { InsightsContentListItemsSubject } from "#sdk/types/insights/dto/content-list-items-subject.ts";

/** Content List Items */
export interface InsightsContentListItems {
  body: string;
  category: InsightsContentListItemsCategory;
  classification: InsightsContentListItemsClassification;
  code: string;
  frontMatter: InsightsContentListItemsFrontMatter;
  image?: string | null;
  isDevelopmentText: boolean;
  language: string;
  slug: string;
  subject: InsightsContentListItemsSubject;
  summary: string;
  tags: string[];
  title: string;
  unresolvedMedia: string[];
}
