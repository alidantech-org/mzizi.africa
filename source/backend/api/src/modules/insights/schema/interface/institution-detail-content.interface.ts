import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { InstitutionDetailContentCategory } from "#/modules/insights/schema/interface/institution-detail-content-category.interface.ts";
import type { InstitutionDetailContentClassification } from "#/modules/insights/schema/interface/institution-detail-content-classification.interface.ts";
import type { InstitutionDetailContentFrontMatter } from "#/modules/insights/schema/interface/institution-detail-content-front-matter.interface.ts";
import type { InstitutionDetailContentSubject } from "#/modules/insights/schema/interface/institution-detail-content-subject.interface.ts";

/** Institution Detail Content */
export interface InstitutionDetailContent {
  body: String;
  category: InstitutionDetailContentCategory;
  classification: InstitutionDetailContentClassification;
  code: String;
  frontMatter: InstitutionDetailContentFrontMatter;
  image: String;
  isDevelopmentText: Flag;
  language: String;
  slug: String;
  subject: InstitutionDetailContentSubject;
  summary: String;
  tags: String[];
  title: String;
  unresolvedMedia: String[];
}
