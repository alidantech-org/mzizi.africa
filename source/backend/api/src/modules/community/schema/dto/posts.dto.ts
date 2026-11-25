import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { PostState } from "#/modules/community/schema/enum/post-state.enum.ts";
import type { Body } from "#/modules/community/schema/type/body.type.ts";
import type { Rating } from "#/modules/community/schema/type/rating.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Every contribution: comments, reviews, reports and questions from signed-in members. (entity)
 */
export class PostsDto {
  @IsString()
  @IsUUID()
  actorId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.body !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(20000)
  body?: Body | null;

  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.deviceId !== null)
  @IsString()
  @IsUUID()
  deviceId?: Id | null;

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
  @ValidateIf((object) => object.languageId !== null)
  @IsString()
  @IsUUID()
  languageId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  parentId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.proofId !== null)
  @IsString()
  @IsUUID()
  proofId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.publishedAt !== null)
  @IsISO8601({})
  publishedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.rating !== null)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: Rating | null;

  @IsEnum(PostState)
  @Satisfies<PostsDto>((object) => object.state !== "published" || object.publishedAt != null, {
    message: "Published Post Has Time",
  })
  state!: PostState;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
