import type { CommunityPostEntry } from "#sdk/types/community/dto/post-entry.ts";

/** Post Collection */
export interface CommunityPostCollection {
  posts: CommunityPostEntry[];
}
