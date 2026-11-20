import type { InsightsContentPageContentCategory } from "#sdk/types/insights/dto/content-page-content-category.ts";
import type { InsightsContentPageContentFrontMatter } from "#sdk/types/insights/dto/content-page-content-front-matter.ts";
import type { InsightsContentPageContentSubject } from "#sdk/types/insights/dto/content-page-content-subject.ts";
import type { InsightsInstitutionDetailContentClassification } from "#sdk/types/insights/dto/institution-detail-content-classification.ts";

/** Content Page Content */
export interface InsightsContentPageContent {
  body: string;
  category: InsightsContentPageContentCategory;
  classification?: InsightsInstitutionDetailContentClassification | null;
  code: string;
  frontMatter: InsightsContentPageContentFrontMatter;
  image?: string | null;
  isDevelopmentText: boolean;
  language: string;
  slug: string;
  subject: InsightsContentPageContentSubject;
  summary: string;
  tags: string[];
  title: string;
  unresolvedMedia: string[];
}
