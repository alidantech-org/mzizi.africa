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
import type { GeoJson } from "#/types/geography/geo-json.type.ts";

/**
 * Geography Map Context Response
 */
export class GeographyMapContextResponseDto {

  @IsOptional()
  @ValidateIf((object) => object.parentGeojson !== null)
  @IsString()
  @MinLength(2)
  parentGeojson?: GeoJson | null;

  @IsString()
  @MinLength(2)
  siblingsGeojson!: GeoJson;
}