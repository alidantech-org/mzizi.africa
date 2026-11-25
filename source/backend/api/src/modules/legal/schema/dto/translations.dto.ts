import {
  IsEnum,
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
import { ReviewStatus } from "#/modules/legal/schema/enum/review-status.enum.ts";
import { TranslationMethod } from "#/modules/legal/schema/enum/translation-method.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString } from "#/modules/shared/schema/type/non-empty-string.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Mzizi's own unofficial translation of a wording; never legal authority. (entity)
 */
export class TranslationsDto {
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

  @IsEnum(TranslationMethod)
  method!: TranslationMethod;

  @IsOptional()
  @ValidateIf((object) => object.notes !== null)
  @IsString()
  @MaxLength(4000)
  notes?: Description | null;

  @IsEnum(ReviewStatus)
  review!: ReviewStatus;

  @IsOptional()
  @ValidateIf((object) => object.reviewedAt !== null)
  @IsISO8601({})
  reviewedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.reviewedById !== null)
  @IsString()
  @IsUUID()
  reviewedById?: Id | null;

  @IsString()
  @MinLength(1)
  text!: NonEmptyString;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;

  @IsString()
  @IsUUID()
  wordingId!: Id;
}
