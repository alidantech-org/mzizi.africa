import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import { PostState } from "#/modules/community/schema/enum/post-state.enum.ts";
import type { Body } from "#/modules/community/schema/type/body.type.ts";
import type { Handle } from "#/modules/community/schema/type/handle.type.ts";
import type { Rating } from "#/modules/community/schema/type/rating.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Post Entry
 */
export class PostEntryDto {
  @ValidateIf((object) => object.body !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(20000)
  body!: Body | null;

  @ValidateIf((object) => object.displayName !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  displayName!: NonEmptyString100 | null;

  @ValidateIf((object) => object.handle !== null)
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(new RegExp("^[a-z][a-z0-9]*([._][a-z0-9]+)*$"))
  handle!: Handle | null;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @ValidateIf((object) => object.languageCode !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  languageCode!: IdentityCode | null;

  @IsString()
  @IsUUID()
  postId!: Id;

  @ValidateIf((object) => object.publishedAt !== null)
  @IsISO8601({})
  publishedAt!: Instant | null;

  @ValidateIf((object) => object.rating !== null)
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: Rating | null;

  @IsEnum(PostState)
  state!: PostState;
}
