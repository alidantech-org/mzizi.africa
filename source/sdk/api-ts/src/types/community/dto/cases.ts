import { CommunityPostState } from "#sdk/types/community/enums/post-state.ts";

/** The moderation of one post. */
export interface CommunityCases {
  createdAt: string;
  decidedAt?: string | null;
  decisionTerm?: string | null;
  deletedAt?: string | null;
  id: string;
  postCountryId: string;
  postId: string;
  reason?: string | null;
  reviewerAccountId?: string | null;
  state: CommunityPostState;
  updatedAt: string;
  version: number;
}
