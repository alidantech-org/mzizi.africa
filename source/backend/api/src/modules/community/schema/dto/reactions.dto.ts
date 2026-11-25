import { IsInt, IsISO8601, IsOptional, IsString, IsUUID, Min, ValidateIf } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A member's reaction to a post, named thing or article. (entity)
 *
 * Invariant "ReactionHasOneSubject" has no simple form, so it isn't validated here.
 */
export class ReactionsDto {
  @IsString()
  @IsUUID()
  actorId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.articleId !== null)
  @IsString()
  @IsUUID()
  articleId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.identityId !== null)
  @IsString()
  @IsUUID()
  identityId?: Id | null;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.postCountryId !== null)
  @IsString()
  @IsUUID()
  postCountryId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.postId !== null)
  @IsString()
  @IsUUID()
  postId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
