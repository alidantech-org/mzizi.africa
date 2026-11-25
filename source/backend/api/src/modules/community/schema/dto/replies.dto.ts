import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Body } from "#/modules/community/schema/type/body.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * An official response to a post. (entity)
 */
export class RepliesDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20000)
  body!: Body;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  languageId!: Id;

  @IsString()
  @IsUUID()
  postCountryId!: Id;

  @IsString()
  @IsUUID()
  postId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.publishedAt !== null)
  @IsISO8601({})
  publishedAt?: Instant | null;

  @IsISO8601({})
  receivedAt!: Instant;

  @IsString()
  @IsUUID()
  respondentId!: Id;

  @IsString()
  @IsUUID()
  statusTerm!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
