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
import { DiagnosticLevel } from "#/types/exchange/diagnostic-level.enum.ts";
import type { JsonDocument } from "#/types/exchange/json-document.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Message } from "#/types/shared/message.type.ts";

/**
 * Extraction Diagnostic
 */
export class ExtractionDiagnosticDto {

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  code!: Label;

  @IsEnum(DiagnosticLevel)
  level!: DiagnosticLevel;

  @IsOptional()
  @IsString()
  @MinLength(2)
  locator?: JsonDocument;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  message!: Message;
}