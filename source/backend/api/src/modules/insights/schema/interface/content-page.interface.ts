import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { ContentPageContent } from "#/modules/insights/schema/interface/content-page-content.interface.ts";
import type { ContentPageRelated } from "#/modules/insights/schema/interface/content-page-related.interface.ts";

/** Content Page */
export interface ContentPage {
  content: ContentPageContent;
  gaps: NonEmptyString500[];
  related: ContentPageRelated[];
}
