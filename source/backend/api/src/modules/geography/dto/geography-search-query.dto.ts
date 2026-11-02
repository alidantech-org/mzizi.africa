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
import type { ResultLimit } from "#/types/geography/result-limit.type.ts";
import type { SearchText } from "#/types/geography/search-text.type.ts";

/**
 * Geography Search Query
 */
export class GeographySearchQueryDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  country?: CountryFilter;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: ResultLimit;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  q!: SearchText;
}
