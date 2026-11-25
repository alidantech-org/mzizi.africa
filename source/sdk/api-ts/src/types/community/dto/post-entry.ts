import { CommunityPostState } from "#sdk/types/community/enums/post-state.ts";

/** Post Entry */
export interface CommunityPostEntry {
  body: string | null;
  displayName: string | null;
  handle: string | null;
  kindTerm: string;
  languageCode: string | null;
  postId: string;
  publishedAt: string | null;
  rating: number | null;
  state: CommunityPostState;
}
