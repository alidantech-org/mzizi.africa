import type { InsightsContentPageRelatedCategory } from "#sdk/types/insights/dto/content-page-related-category.ts";
import type { InsightsContentPageRelatedFrontMatter } from "#sdk/types/insights/dto/content-page-related-front-matter.ts";
import type { InsightsContentPageRelatedSubject } from "#sdk/types/insights/dto/content-page-related-subject.ts";
import type { InsightsInstitutionDetailContentClassification } from "#sdk/types/insights/dto/institution-detail-content-classification.ts";

/** Content Page Related */
export interface InsightsContentPageRelated {
  body: string;
  category: InsightsContentPageRelatedCategory;
  classification?: InsightsInstitutionDetailContentClassification | null;
  code: string;
  frontMatter: InsightsContentPageRelatedFrontMatter;
  image?: string | null;
  isDevelopmentText: boolean;
  language: string;
  slug: string;
  subject: InsightsContentPageRelatedSubject;
  summary: string;
  tags: string[];
  title: string;
  unresolvedMedia: string[];
}
