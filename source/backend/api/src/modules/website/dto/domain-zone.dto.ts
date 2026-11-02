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
import { BaseEntityDto } from "#/modules/shared/dto/base-entity.dto.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Hostname } from "#/types/website/hostname.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Domain Zone (entity)
 */
export class DomainZoneDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.operator !== null)
  @IsString()
  @MinLength(1)
  operator?: LongText | null;

  @IsOptional()
  @ValidateIf((object) => object.parentSuffix !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(253)
  parentSuffix?: Hostname | null;

  @IsOptional()
  @ValidateIf((object) => object.purpose !== null)
  @IsString()
  @MinLength(1)
  purpose?: LongText | null;

  @IsOptional()
  @ValidateIf((object) => object.secondLevelOpen !== null)
  @IsBoolean()
  secondLevelOpen?: Flag | null;

  @IsString()
  @MinLength(1)
  @MaxLength(253)
  suffix!: Hostname;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: Version;
}