import type { PostEntry } from "#/modules/community/schema/interface/post-entry.interface.ts";

/** Post Collection */
export interface PostCollection {
  posts: PostEntry[];
}
