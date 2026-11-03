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
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";

/**
 * Office Holder Search Query
 */
export class OfficeHolderSearchQueryDto {

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  county?: Name;

  @IsOptional()
  @IsBoolean()
  current?: Flag;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  institution?: Name;

  @IsOptional()
  @IsString()
  @IsUUID()
  institutionId?: Id;

  @IsOptional()
  @IsNumber({})
  @Min(0)
  @Max(1000)
  limit?: PaginationNumber;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  office?: Name;

  @IsOptional()
  @IsString()
  @IsUUID()
  officeId?: Id;

  @IsOptional()
  @IsNumber({})
  @Min(0)
  @Max(1000)
  page?: PaginationNumber;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  party?: Name;

  @IsOptional()
  @IsString()
  @IsUUID()
  personId?: Id;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  q?: Name;
}