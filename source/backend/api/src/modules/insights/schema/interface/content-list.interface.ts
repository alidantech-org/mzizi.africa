import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { ContentListCategories } from "#/modules/insights/schema/interface/content-list-categories.interface.ts";
import type { ContentListItems } from "#/modules/insights/schema/interface/content-list-items.interface.ts";

/** Content List */
export interface ContentList {
  categories: ContentListCategories[];
  gaps: NonEmptyString500[];
  items: ContentListItems[];
}
