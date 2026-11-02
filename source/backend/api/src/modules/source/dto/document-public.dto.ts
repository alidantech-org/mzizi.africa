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
import { PublisherDto } from "#/modules/source/dto/publisher.dto.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Citation } from "#/types/source/citation.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Document Public
 *
 * Derived from Document for read.
 */
export class DocumentPublicDto {

  @IsOptional()
  @ValidateIf((object) => object.citation !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  citation?: Citation | null;

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.jurisdictionId !== null)
  @IsString()
  @IsUUID()
  jurisdictionId?: Id | null;

  @IsString()
  @IsUUID()
  kindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.language !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  language?: Label | null;

  @IsOptional()
  @ValidateIf((object) => object.licence !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  licence?: Name | null;

  @IsOptional()
  @ValidateIf((object) => object.publishedOn !== null)
  @IsISO8601({ strict: true })
  publishedOn?: Date | null;

  @IsOptional()
  @ValidateIf((object) => object.publishedOnPrecision !== null)
  @IsEnum(DatePrecision)
  publishedOnPrecision?: DatePrecision | null;

  @IsString()
  @IsUUID()
  publisherId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title!: Name;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.url !== null)
  @IsString()
  @IsUrl()
  @MaxLength(1000)
  url?: Url | null;

  @IsInt()
  @Min(0)
  version!: Version;
}