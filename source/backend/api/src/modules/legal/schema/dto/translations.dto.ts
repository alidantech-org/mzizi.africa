import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import { ReviewStatus } from "#/modules/legal/schema/enum/review-status.enum.ts";
import { TranslationMethod } from "#/modules/legal/schema/enum/translation-method.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { NonEmptyString } from "#/modules/shared/schema/type/non-empty-string.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A translated representation of one exact wording. Several translations into one language are valid; review never makes a translation legal authority. (entity)
 */
export class TranslationsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

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

  @IsOptional()
  @ValidateIf((object) => object.producedAt !== null)
  @IsISO8601({})
  producedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.producedBy !== null)
  @IsString()
  @IsJSON()
  producedBy?: JsonText | null;

  @IsEnum(ReviewStatus)
  reviewStatus!: ReviewStatus;

  @IsOptional()
  @ValidateIf((object) => object.reviewedAt !== null)
  @IsISO8601({})
  reviewedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.reviewedBySnapshot !== null)
  @IsString()
  @IsJSON()
  reviewedBySnapshot?: JsonText | null;

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
