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
import { SegmentKind } from "#/types/exchange/segment-kind.enum.ts";
import type { JsonDocument } from "#/types/exchange/json-document.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Label } from "#/types/shared/label.type.ts";

/**
 * Extraction Segment
 */
export class ExtractionSegmentDto {

  @IsOptional()
  @IsNumber({})
  @Min(0)
  @Max(1)
  confidence?: Confidence;

  @IsString()
  @MinLength(2)
  content!: JsonDocument;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  key!: Label;

  @IsEnum(SegmentKind)
  kind!: SegmentKind;

  @IsString()
  @MinLength(2)
  locator!: JsonDocument;
}