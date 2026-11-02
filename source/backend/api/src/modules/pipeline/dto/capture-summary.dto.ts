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
import type { Text } from "#/types/pipeline/text.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Capture Summary
 */
export class CaptureSummaryDto {

  @IsOptional()
  @ValidateIf((object) => object.contentHash !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  contentHash?: Label | null;

  @IsString()
  @IsUUID()
  documentId!: Id;

  @IsString()
  @MinLength(0)
  @MaxLength(5000)
  documentTitle!: Text;

  @IsOptional()
  @ValidateIf((object) => object.httpStatus !== null)
  @IsNumber({})
  @Min(0)
  @Max(1000)
  httpStatus?: PaginationNumber | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsISO8601({})
  retrievedAt!: DateTime;

  @IsOptional()
  @ValidateIf((object) => object.retrievedUrl !== null)
  @IsString()
  @MinLength(0)
  @MaxLength(5000)
  retrievedUrl?: Text | null;

  @IsOptional()
  @ValidateIf((object) => object.siteId !== null)
  @IsString()
  @IsUUID()
  siteId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.tool !== null)
  @IsString()
  @MinLength(0)
  @MaxLength(5000)
  tool?: Text | null;
}