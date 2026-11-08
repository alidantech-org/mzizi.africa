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

/**
 * Promote Response
 */
export class PromoteResponseDto {

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  outcome!: Label;

  @IsOptional()
  @ValidateIf((object) => object.reason !== null)
  @IsString()
  @MinLength(0)
  @MaxLength(5000)
  reason?: Text | null;

  @IsOptional()
  @ValidateIf((object) => object.recordId !== null)
  @IsString()
  @IsUUID()
  recordId?: Id | null;
}