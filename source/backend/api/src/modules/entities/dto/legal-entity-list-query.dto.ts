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
import { BaseQueryDto } from "#/modules/shared/dto/base-query.dto.ts";
import { EntityStatus } from "#/types/entities/entity-status.enum.ts";
import { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";

/**
 * Legal Entity List Query
 */
export class LegalEntityListQueryDto {

  @IsOptional()
  @IsBoolean()
  includeHistory?: Flag;

  @IsOptional()
  @IsString()
  @IsUUID()
  jurisdictionId?: Id;

  @IsOptional()
  @IsNumber({})
  @Min(0)
  @Max(1000)
  limit?: PaginationNumber;

  @IsOptional()
  @IsEnum(SortDirection)
  order?: SortDirection;

  @IsOptional()
  @IsNumber({})
  @Min(0)
  @Max(1000)
  page?: PaginationNumber;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  q?: Name;

  @IsOptional()
  @IsEnum(SortDirection)
  sort?: SortDirection;

  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;
}