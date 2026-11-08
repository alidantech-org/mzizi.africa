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
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";

/**
 * Draft Assessment Request
 */
export class DraftAssessmentRequestDto {

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  accessBasis!: Label;

  @IsString()
  @MinLength(2)
  approvedScope!: JsonText;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(5000)
  evidence?: Text;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(5000)
  rationale?: Text;

  @IsString()
  @MinLength(0)
  @MaxLength(5000)
  rightsHolder!: Text;

  @IsString()
  @IsUUID()
  siteId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  sourceType!: Label;
}