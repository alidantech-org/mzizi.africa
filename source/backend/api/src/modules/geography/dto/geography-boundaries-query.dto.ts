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
import type { CountryFilter } from "#/types/geography/country-filter.type.ts";
import type { Label } from "#/types/shared/label.type.ts";

/**
 * Geography Boundaries Query
 */
export class GeographyBoundariesQueryDto {

  @IsString()
  @MinLength(2)
  @MaxLength(40)
  country!: CountryFilter;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  level!: Label;
}