import type { InsightsContentPageContent } from "#sdk/types/insights/dto/content-page-content.ts";
import type { InsightsContentPageRelated } from "#sdk/types/insights/dto/content-page-related.ts";

/** Content Page */
export interface InsightsContentPage {
  content: InsightsContentPageContent;
  gaps: string[];
  related: InsightsContentPageRelated[];
}
