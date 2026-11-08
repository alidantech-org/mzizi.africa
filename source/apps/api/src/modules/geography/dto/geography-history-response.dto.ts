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
import { GeoUnitChangePublicDto } from "#/modules/geography/dto/geo-unit-change-public.dto.ts";
import { GeoUnitNameVersionPublicDto } from "#/modules/geography/dto/geo-unit-name-version-public.dto.ts";

/**
 * Geography History Response
 */
export class GeographyHistoryResponseDto {

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => GeoUnitChangePublicDto)
  changes!: GeoUnitChangePublicDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => GeoUnitNameVersionPublicDto)
  names!: GeoUnitNameVersionPublicDto[];
}