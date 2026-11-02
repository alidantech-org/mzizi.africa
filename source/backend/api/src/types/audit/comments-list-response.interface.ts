
import type { CommentPublic } from "#/types/audit/comment-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Comments List Response */
export interface CommentsListResponse {
  comments: CommentPublic[];
  meta: PaginationMeta;
}