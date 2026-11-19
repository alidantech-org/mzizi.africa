import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { ContentListItemsCategory } from "#/modules/insights/schema/interface/content-list-items-category.interface.ts";
import type { ContentListItemsClassification } from "#/modules/insights/schema/interface/content-list-items-classification.interface.ts";
import type { ContentListItemsFrontMatter } from "#/modules/insights/schema/interface/content-list-items-front-matter.interface.ts";
import type { ContentListItemsSubject } from "#/modules/insights/schema/interface/content-list-items-subject.interface.ts";

/** Content List Items */
export interface ContentListItems {
  body: String;
  category: ContentListItemsCategory;
  classification: ContentListItemsClassification;
  code: String;
  frontMatter: ContentListItemsFrontMatter;
  image?: String | null;
  isDevelopmentText: Flag;
  language: String;
  slug: String;
  subject: ContentListItemsSubject;
  summary: String;
  tags: String[];
  title: String;
  unresolvedMedia: String[];
}
