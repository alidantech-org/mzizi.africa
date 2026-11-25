import type { PostState } from "#/modules/community/schema/enum/post-state.enum.ts";
import type { Body } from "#/modules/community/schema/type/body.type.ts";
import type { Handle } from "#/modules/community/schema/type/handle.type.ts";
import type { Rating } from "#/modules/community/schema/type/rating.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Post Entry */
export interface PostEntry {
  body: Body | null;
  displayName: NonEmptyString100 | null;
  handle: Handle | null;
  kindTerm: Id;
  languageCode: IdentityCode | null;
  postId: Id;
  publishedAt: Instant | null;
  rating: Rating | null;
  state: PostState;
}
