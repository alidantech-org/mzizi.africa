import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from "class-validator";

import { PostState } from "#/modules/community/schema/enum/post-state.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * The moderation of one post. (entity)
 */
export class CasesDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.decidedAt !== null)
  @IsISO8601({})
  decidedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.decisionTerm !== null)
  @IsString()
  @IsUUID()
  decisionTerm?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  postCountryId!: Id;

  @IsString()
  @IsUUID()
  postId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.reason !== null)
  @IsString()
  @MaxLength(4000)
  reason?: Description | null;

  @IsOptional()
  @ValidateIf((object) => object.reviewerAccountId !== null)
  @IsString()
  @IsUUID()
  reviewerAccountId?: Id | null;

  @IsEnum(PostState)
  state!: PostState;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
