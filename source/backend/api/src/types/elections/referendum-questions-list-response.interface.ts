
import type { ReferendumQuestionPublic } from "#/types/elections/referendum-question-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Referendum Questions List Response */
export interface ReferendumQuestionsListResponse {
  meta: PaginationMeta;
  questions: ReferendumQuestionPublic[];
}