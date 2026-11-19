import type { InsightsContentListCategories } from "#sdk/types/insights/content-list-categories.ts";
import type { InsightsContentListItems } from "#sdk/types/insights/content-list-items.ts";

/** Content List */
export interface InsightsContentList {
  categories: InsightsContentListCategories[];
  gaps: string[];
  items: InsightsContentListItems[];
}
