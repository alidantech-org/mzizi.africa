import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { ContentPageRelatedCategory } from "#/modules/insights/schema/interface/content-page-related-category.interface.ts";
import type { ContentPageRelatedFrontMatter } from "#/modules/insights/schema/interface/content-page-related-front-matter.interface.ts";
import type { ContentPageRelatedSubject } from "#/modules/insights/schema/interface/content-page-related-subject.interface.ts";
import type { InstitutionDetailContentClassification } from "#/modules/insights/schema/interface/institution-detail-content-classification.interface.ts";

/** Content Page Related */
export interface ContentPageRelated {
  body: String;
  category: ContentPageRelatedCategory;
  classification?: InstitutionDetailContentClassification | null;
  code: String;
  frontMatter: ContentPageRelatedFrontMatter;
  image?: String | null;
  isDevelopmentText: Flag;
  language: String;
  slug: String;
  subject: ContentPageRelatedSubject;
  summary: String;
  tags: String[];
  title: String;
  unresolvedMedia: String[];
}
