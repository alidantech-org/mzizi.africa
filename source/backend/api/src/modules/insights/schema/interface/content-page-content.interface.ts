import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { ContentPageContentCategory } from "#/modules/insights/schema/interface/content-page-content-category.interface.ts";
import type { ContentPageContentFrontMatter } from "#/modules/insights/schema/interface/content-page-content-front-matter.interface.ts";
import type { ContentPageContentSubject } from "#/modules/insights/schema/interface/content-page-content-subject.interface.ts";
import type { InstitutionDetailContentClassification } from "#/modules/insights/schema/interface/institution-detail-content-classification.interface.ts";

/** Content Page Content */
export interface ContentPageContent {
  body: String;
  category: ContentPageContentCategory;
  classification?: InstitutionDetailContentClassification | null;
  code: String;
  frontMatter: ContentPageContentFrontMatter;
  image?: String | null;
  isDevelopmentText: Flag;
  language: String;
  slug: String;
  subject: ContentPageContentSubject;
  summary: String;
  tags: String[];
  title: String;
  unresolvedMedia: String[];
}
