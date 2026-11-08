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
import type { Label } from "#/types/shared/label.type.ts";

/**
 * Candidate Issue
 */
export class CandidateIssueDto {

  @IsString()
  @MinLength(0)
  @MaxLength(5000)
  message!: Text;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  rule!: Label;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  severity!: Label;
}