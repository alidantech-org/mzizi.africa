import type { InsightsInstitutionDetailContentCategory } from "#sdk/types/insights/dto/institution-detail-content-category.ts";
import type { InsightsInstitutionDetailContentClassification } from "#sdk/types/insights/dto/institution-detail-content-classification.ts";
import type { InsightsInstitutionDetailContentFrontMatter } from "#sdk/types/insights/dto/institution-detail-content-front-matter.ts";
import type { InsightsInstitutionDetailContentSubject } from "#sdk/types/insights/dto/institution-detail-content-subject.ts";

/** Institution Detail Content */
export interface InsightsInstitutionDetailContent {
  body: string;
  category: InsightsInstitutionDetailContentCategory;
  classification: InsightsInstitutionDetailContentClassification;
  code: string;
  frontMatter: InsightsInstitutionDetailContentFrontMatter;
  image: string;
  isDevelopmentText: boolean;
  language: string;
  slug: string;
  subject: InsightsInstitutionDetailContentSubject;
  summary: string;
  tags: string[];
  title: string;
  unresolvedMedia: string[];
}
