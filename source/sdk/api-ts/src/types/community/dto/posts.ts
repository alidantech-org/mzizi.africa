import { CommunityPostState } from "#sdk/types/community/enums/post-state.ts";

/** Every contribution: comments, reviews, reports and questions from signed-in members. */
export interface CommunityPosts {
  actorId: string;
  body?: string | null;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  deviceId?: string | null;
  id: string;
  identityId?: string | null;
  kindTerm: string;
  languageId?: string | null;
  parentId?: string | null;
  proofId?: string | null;
  publishedAt?: string | null;
  rating?: number | null;
  state: CommunityPostState;
  updatedAt: string;
  version: number;
}
