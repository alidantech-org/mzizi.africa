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
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";

/**
 * Pagination Meta
 */
export class PaginationMetaDto {
  @IsNumber({})
  @Min(0)
  @Max(1000)
  limit!: PaginationNumber;

  @IsNumber({})
  @Min(0)
  @Max(1000)
  page!: PaginationNumber;

  @IsNumber({})
  @Min(0)
  @Max(1000)
  total!: PaginationNumber;

  @IsNumber({})
  @Min(0)
  @Max(1000)
  totalPages!: PaginationNumber;
}
