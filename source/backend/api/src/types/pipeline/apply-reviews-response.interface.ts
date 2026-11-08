
import type { JsonText } from "#/types/pipeline/json-text.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";

/** Apply Reviews Response */
export interface ApplyReviewsResponse {
  applied: PaginationNumber;
  detail: JsonText;
}