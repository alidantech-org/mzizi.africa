import { Type } from "class-transformer";
import {
  Allow,
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBase64,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsFQDN,
  IsHexadecimal,
  IsHexColor,
  IsInt,
  IsIP,
  IsISO31661Alpha2,
  IsISO4217CurrencyCode,
  IsISO8601,
  IsJSON,
  IsJWT,
  IsLocale,
  IsMimeType,
  IsNumber,
  IsObject,
  IsOptional,
  IsSemVer,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsDivisibleBy,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";

import { Satisfies } from "#/modules/common/dto/validators/satisfies.ts";
import { SiteDto } from "#/modules/website/dto/site.dto.ts";
import { CheckKind } from "#/types/website/check-kind.enum.ts";
import { CheckOutcome } from "#/types/website/check-outcome.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Site Check Public
 *
 * Derived from SiteCheck for read.
 */
export class SiteCheckPublicDto {

  @IsISO8601({})
  checkedAt!: DateTime;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.detail !== null)
  @IsString()
  @MinLength(1)
  detail?: LongText | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(CheckKind)
  kind!: CheckKind;

  @IsEnum(CheckOutcome)
  outcome!: CheckOutcome;

  @IsString()
  @IsUUID()
  siteId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.structureVersionId !== null)
  @IsString()
  @IsUUID()
  structureVersionId?: Id | null;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}