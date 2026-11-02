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
import { SiteDto } from "#/modules/website/dto/site.dto.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { DomainRole } from "#/types/website/domain-role.enum.ts";
import { UrlScheme } from "#/types/website/url-scheme.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Hostname } from "#/types/website/hostname.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Site Domain (entity)
 */
export class SiteDomainDto {

  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @MinLength(1)
  @MaxLength(253)
  hostname!: Hostname;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.observedAt !== null)
  @IsISO8601({})
  observedAt?: DateTime | null;

  @IsEnum(DomainRole)
  role!: DomainRole;

  @IsEnum(UrlScheme)
  scheme!: UrlScheme;

  @IsString()
  @IsUUID()
  siteId!: Id;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsISO8601({ strict: true })
  validFrom!: Date;

  @IsEnum(DatePrecision)
  validFromPrecision!: DatePrecision;

  @IsOptional()
  @ValidateIf((object) => object.validTo !== null)
  @IsISO8601({ strict: true })
  validTo?: Date | null;

  @IsOptional()
  @ValidateIf((object) => object.validToPrecision !== null)
  @IsEnum(DatePrecision)
  validToPrecision?: DatePrecision | null;

  @IsInt()
  @Min(0)
  version!: Version;
}