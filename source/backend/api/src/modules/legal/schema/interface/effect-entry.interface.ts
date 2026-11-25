import type { ReviewStatus } from "#/modules/legal/schema/enum/review-status.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Effect Entry */
export interface EffectEntry {
  designation: NonEmptyString255;
  effectId: Id;
  effectiveOn: CalendarDate | null;
  instrumentId: Id;
  kindTerm: Id;
  provisionId: Id;
  reviewStatus: ReviewStatus;
  wordingId: Id;
}
