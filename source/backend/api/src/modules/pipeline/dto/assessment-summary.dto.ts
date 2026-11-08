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
import type { JsonText } from "#/types/pipeline/json-text.type.ts";
import type { Text } from "#/types/pipeline/text.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Assessment Summary
 */
export class AssessmentSummaryDto {

  @IsString()
  @MinLength(2)
  approvedScope!: JsonText;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isCurrent!: Flag;

  @IsOptional()
  @ValidateIf((object) => object.rationale !== null)
  @IsString()
  @MinLength(0)
  @MaxLength(5000)
  rationale?: Text | null;

  @IsOptional()
  @ValidateIf((object) => object.reviewedAt !== null)
  @IsISO8601({})
  reviewedAt?: DateTime | null;

  @IsOptional()
  @ValidateIf((object) => object.reviewedBy !== null)
  @IsString()
  @IsUUID()
  reviewedBy?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  rightsHolder!: Label;

  @IsString()
  @IsUUID()
  siteId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  siteName!: Label;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  sourceType!: Label;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  status!: Label;
}